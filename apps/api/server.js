const express = require('express');
const cors = require('cors');
const path = require('path');
const archiveRouter = require('./routes/archive.routes.js');
const slideRouter = require('./routes/slide.routes.js');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Expose uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (req, res) => res.json({ ok: true }));

// Routes
app.use('/archives', archiveRouter);
app.use('/archives', slideRouter); // Slide routes are prefixed with /archives/:archiveId/...

const port = Number(process.env.API_PORT ?? 4000);
app.listen(port, () => console.log(`Sibling Archive API listening on :${port}`));

module.exports = app;
