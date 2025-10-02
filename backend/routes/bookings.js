const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { authenticate, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const { sendBookingConfirmation } = require('../utils/emailService')
const router = express.Router();


// Create booking
router.post('/', [
  body('customer.name').notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().withMessage('Valid email is required'),
  body('customer.phone').notEmpty().withMessage('Phone is required'),
  body('services').isArray().withMessage('Services must be an array'),
  body('appointmentDate').isISO8601().withMessage('Valid date is required'),
  body('appointmentTime').notEmpty().withMessage('Time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { customer, services, appointmentDate, appointmentTime, notes } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    const serviceDetails = [];

    for (const serviceItem of services) {
      const service = await Service.findById(serviceItem.service);
      if (!service) {
        return res.status(400).json({ 
          success: false, 
          message: `Service not found: ${serviceItem.service}` 
        });
      }
      serviceDetails.push({
        service: service._id,
        price: service.price
      });
      totalAmount += service.price;
    }

    const booking = new Booking({
      customer,
      services: serviceDetails,
      appointmentDate,
      appointmentTime,
      totalAmount,
      notes
    });

    await booking.save();
    await booking.populate('services.service');
      await sendBookingConfirmation(booking);

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all bookings (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.appointmentDate = { $gte: startDate, $lt: endDate };
    }

    const bookings = await Booking.find(query)
      .populate('services.service')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: bookings,
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

// Update booking status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('services.service');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;