const express = require('express');
const axios = require('axios');
const SocialMedia = require('../models/SocialMedia');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get social media stats
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const stats = await SocialMedia.find().sort({ lastUpdated: -1 });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Instagram stats (Admin only)
router.post('/instagram/update', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This would use Instagram Basic Display API
    // For demo purposes, using dummy data
    const instagramData = {
      platform: 'instagram',
      metrics: {
        followers: Math.floor(Math.random() * 10000) + 5000,
        posts: Math.floor(Math.random() * 100) + 50,
        engagement: Math.floor(Math.random() * 5) + 2,
        likes: Math.floor(Math.random() * 1000) + 500
      },
      lastUpdated: new Date()
    };

    const stats = await SocialMedia.findOneAndUpdate(
      { platform: 'instagram' },
      instagramData,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update YouTube stats (Admin only)
router.post('/youtube/update', authenticate, authorize('admin'), async (req, res) => {
  try {
    // This would use YouTube Data API v3
    // For demo purposes, using dummy data
    const youtubeData = {
      platform: 'youtube',
      metrics: {
        followers: Math.floor(Math.random() * 5000) + 1000,
        views: Math.floor(Math.random() * 50000) + 10000,
        engagement: Math.floor(Math.random() * 3) + 1,
        posts: Math.floor(Math.random() * 50) + 20
      },
      lastUpdated: new Date()
    };

    const stats = await SocialMedia.findOneAndUpdate(
      { platform: 'youtube' },
      youtubeData,
      { new: true, upsert: true }
    );

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get social media suggestions
router.get('/suggestions', authenticate, authorize('admin'), async (req, res) => {
  try {
    const instagramStats = await SocialMedia.findOne({ platform: 'instagram' });
    const youtubeStats = await SocialMedia.findOne({ platform: 'youtube' });

    const suggestions = [];

    if (instagramStats) {
      if (instagramStats.metrics.engagement < 3) {
        suggestions.push({
          platform: 'instagram',
          type: 'engagement',
          message: 'Your Instagram engagement is low. Consider posting more interactive content like polls and questions.',
          priority: 'high'
        });
      }
      
      if (instagramStats.metrics.posts < 30) {
        suggestions.push({
          platform: 'instagram',
          type: 'content',
          message: 'Increase your posting frequency. Aim for at least 3-4 posts per week.',
          priority: 'medium'
        });
      }
    }

    if (youtubeStats) {
      if (youtubeStats.metrics.engagement < 2) {
        suggestions.push({
          platform: 'youtube',
          type: 'engagement',
          message: 'YouTube engagement could be improved. Try adding call-to-actions in your videos.',
          priority: 'high'
        });
      }
    }

    // General suggestions based on beauty industry trends
    suggestions.push({
      platform: 'general',
      type: 'trend',
      message: 'Beauty tutorials and before/after transformations perform well. Consider creating more of this content.',
      priority: 'medium'
    });

    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;