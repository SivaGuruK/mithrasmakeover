
// routes/admin.js
const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Analytics = require('../models/Analytics');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard overview
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Overview stats
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments({ isActive: true });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    // Monthly revenue
    const monthlyRevenue = await Booking.aggregate([
      { 
        $match: { 
          createdAt: { $gte: startOfMonth }, 
          status: { $in: ['confirmed', 'completed'] }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('services.service')
      .sort({ createdAt: -1 })
      .limit(5);

    // Page views this week
    const weeklyPageViews = await Analytics.countDocuments({
      type: 'page_view',
      timestamp: { $gte: startOfWeek }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalBookings,
          totalServices,
          pendingBookings,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          weeklyPageViews
        },
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users (Admin only)
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle user status (Admin only)
router.put('/users/:id/toggle-status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      success: true, 
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { id: user._id, isActive: user.isActive }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get system statistics
router.get('/statistics', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Monthly booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // Service popularity
    const servicePopularity = await Booking.aggregate([
      { $unwind: '$services' },
      {
        $group: {
          _id: '$services.service',
          bookings: { $sum: 1 },
          revenue: { $sum: '$services.price' }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      { $sort: { bookings: -1 } }
    ]);

    // Customer demographics (mock data for demo)
    const demographics = {
      ageGroups: [
        { range: '18-25', count: Math.floor(Math.random() * 50) + 20 },
        { range: '26-35', count: Math.floor(Math.random() * 80) + 40 },
        { range: '36-45', count: Math.floor(Math.random() * 60) + 30 },
        { range: '46+', count: Math.floor(Math.random() * 30) + 10 }
      ],
      locations: [
        { city: 'Mumbai', count: Math.floor(Math.random() * 100) + 50 },
        { city: 'Delhi', count: Math.floor(Math.random() * 80) + 40 },
        { city: 'Bangalore', count: Math.floor(Math.random() * 60) + 30 },
        { city: 'Chennai', count: Math.floor(Math.random() * 50) + 25 }
      ]
    };

    res.json({
      success: true,
      data: {
        bookingTrends,
        servicePopularity,
        demographics
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;