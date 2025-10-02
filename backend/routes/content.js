const express = require('express');
const Content = require('../models/Content');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET all content
router.get('/', async (req, res) => {
  try {
    const content = await Content.find();
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET content by section
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne({ section: req.params.section });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE content with file upload
router.put('/:section', authenticate, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    const section = req.params.section;
    const data = {};

    // Collect fields
    for (const key in req.body) {
      if (key.includes('[')) {
        // Handle nested keys like stats[happyBrides]
        const matches = key.match(/^(.+?)\[(.+?)\]$/);
        if (matches) {
          const parentKey = matches[1];
          const subKey = matches[2];

          if (!data[parentKey]) data[parentKey] = {};
          data[parentKey][subKey] = req.body[key];
        }
      } else {
        data[key] = req.body[key];
      }
    }

    // Handle uploaded image
    if (req.file && req.file.path) {
      data.image = req.file.path;
    } else if (req.body.existingImage) {
      data.image = req.body.existingImage;
    }

    const updatedContent = await Content.findOneAndUpdate(
      { section },
      { data },
      { new: true, upsert: true }
    );

    res.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
