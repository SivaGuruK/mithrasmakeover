// routes/gallery.js
const express = require('express');
const Gallery = require('../models/Gallery');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const gallery = await Gallery.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload gallery image (Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.single('image'), // field name remains 'image' for both
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Media file is required' });
      }

      const { title, description, category, tags } = req.body;
      const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

      const galleryItem = new Gallery({
        title,
        description,
        mediaUrl: req.file.path, // Cloudinary returns full URL here
        mediaType,
        category,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : []
      });

      await galleryItem.save();

      res.status(201).json({ success: true, data: galleryItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Update gallery item (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.mediaUrl = req.file.path;
        updateData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
      }

      if (updateData.tags) {
        updateData.tags = updateData.tags.split(',').map(tag => tag.trim());
      }

      const galleryItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });

      if (!galleryItem) {
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
      }

      res.json({ success: true, data: galleryItem });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Delete gallery item (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id, 
      { isActive: false }, 
      { new: true }
    );
    if (!galleryItem) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
