const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  icon: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  category: { type: String, required: true },
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
