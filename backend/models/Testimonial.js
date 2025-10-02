//models/testimonial/js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientImage: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  service: { type: String},
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);