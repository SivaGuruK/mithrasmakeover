const express = require('express');
const Analytics = require('../models/Analytics');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Track page view
router.post('/page-view', async (req, res) => {
  try {
    const { page, userAgent } = req.body;
    const ip = req.ip;

    const analytics = new Analytics({
      type: 'page_view',
      data: { page },
      userAgent,
      ip
    });

    await analytics.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get dashboard analytics (Admin only)
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { timeframe = '30' } = req.query;
    const daysAgo = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Page views
    const pageViews = await Analytics.aggregate([
      { $match: { type: 'page_view', timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          views: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Booking stats
    const bookingStats = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    // Popular services
    const popularServices = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: "$services" },
      {
        $group: {
          _id: "$services.service",
          bookings: { $sum: 1 },
          revenue: { $sum: "$services.price" }
        }
      },
      {
        $lookup: {
          from: "services",
          localField: "_id",
          foreignField: "_id",
          as: "service"
        }
      },
      { $unwind: "$service" },
      { $sort: { bookings: -1 } },
      { $limit: 5 }
    ]);

    // Total users
    const totalUsers = await User.countDocuments({ role: 'customer' });

    res.json({
      success: true,
      data: {
        pageViews,
        bookingStats,
        popularServices,
        totalUsers,
        timeframe: `${daysAgo} days`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;