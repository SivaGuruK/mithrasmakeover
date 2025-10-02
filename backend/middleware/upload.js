const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const path = require('path');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isVideo = file.mimetype.startsWith('video/');

    return {
      folder: 'MITHRAS MAKEOVER',
      resource_type: isVideo ? 'video' : 'image',
      format: isVideo ? 'mp4' : undefined,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/jpg',
      'video/mp4', 'video/webm'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WEBP images and MP4/WEBM videos are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
