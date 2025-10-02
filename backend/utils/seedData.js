const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Service = require('../models/Service');
const Content = require('../models/Content');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mithrasmakeover');
    
    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Content.deleteMany({});
    await Gallery.deleteMany({});
    await Testimonial.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    await User.create({
      name: 'MITHRAS MAKEOVER',
      email: 'admin@mithrasmakeover.com',
      phone: '+91 98765 43210',
      password: adminPassword,
      role: 'admin'
    });

    // Create services
    const services = [
      {
        title: 'Bridal Makeup',
        description: 'Complete bridal transformation with premium products',
        price: 15000,
        duration: 180,
        icon: 'lips',
        category: 'makeup'
      },
      {
        title: 'Party Makeup',
        description: 'Glamorous looks for special occasions',
        price: 8000,
        duration: 120,
        icon: 'sparkles',
        category: 'makeup'
      },
      {
        title: 'Mehndi Design',
        description: 'Intricate traditional and modern patterns',
        price: 5000,
        duration: 90,
        icon: 'hand',
        category: 'mehndi'
      },
      {
        title: 'Hair Styling',
        description: 'Professional hairstyling and updos',
        price: 4000,
        duration: 60,
        icon: 'scissors',
        category: 'hair'
      }
    ];

    await Service.insertMany(services);

    // Create content
    const content = [
      {
        section: 'hero',
        data: {
          title: 'Beauty That Captivates',
          subtitle: 'Transform your special moments with professional makeup artistry and intricate mehndi designs that celebrate your unique beauty.',
          primaryButton: 'Book Appointment',
          secondaryButton: 'View Portfolio'
        }
      },
      {
        section: 'about',
        data: {
          title: 'Meet MITHRA',
          description: 'With over 8 years of experience in the beauty industry, I specialize in creating stunning makeup looks and intricate mehndi designs that enhance your natural beauty.',
          stats: {
            happyBrides: '500+',
            yearsExperience: '8+',
            certification: 'Certified Professional',
            specialization: 'Licensed makeup artist and mehndi specialist'
          }
        }
      },
      {
        section: 'contact',
        data: {
          phone: '+91 98765 43210',
          email: 'hello@mithrasmakeover.com',
          address: '123 Beauty Lane, Mumbai',
          socialMedia: {
            instagram: 'https://instagram.com/mithrasmakeiver',
            youtube: 'https://youtube.com/mithrasmakeover',
            facebook: 'https://facebook.com/mithrasmakeover'
          }
        }
      }
    ];

    await Content.insertMany(content);

    // Create sample testimonials
    const testimonials = [
      {
        clientName: 'Priya Sharma',
        rating: 5,
        review: 'Mithra made my wedding day absolutely perfect! Her attention to detail and artistic skills are unmatched. I felt like a queen!',
        isApproved: true
      },
      {
        clientName: 'Neha Patel',
        rating: 5,
        review: 'The mehndi design was absolutely stunning! Mithra\'s creativity and precision are incredible. Highly recommended for any special occasion.',
        isApproved: true
      },
      {
        clientName: 'Anita Singh',
        rating: 5,
        review: 'Professional, talented, and so easy to work with! My party makeup looked flawless and lasted the entire night. Thank you, Mithra!',
        isApproved: true
      }
    ];

    await Testimonial.insertMany(testimonials);

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@mithrasmakeover.com');
    console.log('🔑 Admin password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();