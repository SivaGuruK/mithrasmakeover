const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // 'instagram', 'youtube'
  metrics: {
    followers: Number,
    posts: Number,
    engagement: Number,
    views: Number,
    likes: Number
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialMedia', socialMediaSchema);
