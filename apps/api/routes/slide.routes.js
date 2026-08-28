const express = require('express');
const multer = require('multer');
const path = require('path');
const { slideService } = require('../services/slide.service.js');
const { validateCreateSlideInput } = require('../validators/slide.schema.js');
const { prisma } = require('../lib/prisma.js');

const router = express.Router();

// Configure multer for local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/:archiveId/slides', upload.single('file'), async (req, res) => {
  try {
    const { archiveId } = req.params;

    // 1. Validate archive exists
    const archive = await prisma.archive.findUnique({ where: { id: archiveId } });
    if (!archive) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Archive not found.' });
    }

    // 2. Parse and validate slide input
    let slideData = req.body;
    if (typeof req.body.data === 'string') {
      try {
        slideData.data = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Invalid JSON in data field.' });
      }
    }

    const validated = validateCreateSlideInput({
      type: req.body.type,
      position: parseInt(req.body.position, 10),
      data: slideData.data,
    });

    // 3. Handle uploaded file for PHOTO type
    if (validated.type === 'PHOTO') {
      if (!req.file) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Photo file is required for PHOTO slide type.' });
      }
      // Add the public URL to the data field
      validated.data.imageUrl = `/uploads/${req.file.filename}`;
    }

    // 4. Create the slide
    const result = await slideService.createSlide(archiveId, validated);
    return res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'BAD_REQUEST', message: err.message });
    }
    console.error('Slide creation error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' });
  }
});

router.get('/:archiveId/slides', async (req, res) => {
  try {
    const { archiveId } = req.params;
    const slides = await slideService.getSlidesByArchive(archiveId);
    return res.status(200).json(slides);
  } catch (err) {
    console.error('Get slides error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
