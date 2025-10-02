const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  services: [{
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    price: { type: Number, required: true }
  }],
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  notes: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);