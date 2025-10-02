const express = require('express');
const Testimonial = require('../models/Testimonial');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get approved testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      isApproved: true, 
      isActive: true 
    }).populate('service').sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create testimonial
router.post('/', upload.single('clientImage'), async (req, res) => {
  try {
    const { clientName, rating, review, service } = req.body;
    
    const testimonial = new Testimonial({
      clientName,
      clientImage: req.file ? req.file.path : null,
      rating,
      review,
      service
    });

    await testimonial.save();
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all testimonials (Admin only)
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('service').sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  }catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve a testimonial (Admin only)
router.put('/:id/approve', authenticate, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update visibility (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a testimonial (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;