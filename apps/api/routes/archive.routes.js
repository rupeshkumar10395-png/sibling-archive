const express = require('express');
const { archiveService } = require('../services/archive.service.js');
const { validateCreateArchiveInput } = require('../validators/archive.schema.js');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const validated = validateCreateArchiveInput(req.body);
    const result = await archiveService.createArchive(validated);
    return res.status(201).json(result);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'BAD_REQUEST', message: err.message });
    }
    console.error('Archive creation error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' });
  }
});

router.get('/slug/:slug', async (req, res) => {
  try {
    const archive = await archiveService.getArchiveBySlug(req.params.slug);
    if (!archive) {
      return res.status(404).json({ error: 'NOT_FOUND', message: 'Archive not found.' });
    }
    return res.status(200).json(archive);
  } catch (err) {
    console.error('Get archive by slug error:', err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});

module.exports = router;
