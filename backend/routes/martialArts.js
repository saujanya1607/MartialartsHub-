const express = require('express');
const router = express.Router();
const MartialArt = require('../models/MartialArt');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// GET /api/martial-arts — list with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { country, category, difficulty, type, usesWeapons, search, page = 1, limit = 20, featured } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (country) query.country = new RegExp(country, 'i');
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;
    if (usesWeapons !== undefined) query.usesWeapons = usesWeapons === 'true';
    if (featured === 'true') query.isFeatured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      MartialArt.find(query)
        .select('-history -philosophy -learningPath')
        .skip(skip).limit(parseInt(limit))
        .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 }),
      MartialArt.countDocuments(query),
    ]);

    res.json({ data, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/martial-arts/countries — unique country list
router.get('/countries', async (req, res) => {
  try {
    const countries = await MartialArt.distinct('country');
    res.json(countries.sort());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/martial-arts/featured
router.get('/featured', async (req, res) => {
  try {
    const data = await MartialArt.find({ isFeatured: true }).limit(8).select('-history -philosophy');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/martial-arts/:slug — full detail
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const art = await MartialArt.findOne({ slug: req.params.slug })
      .populate('techniques', 'name slug category difficulty')
      .populate('relatedArts', 'name slug country coverImage');

    if (!art) return res.status(404).json({ error: 'Martial art not found' });

    // Increment view count
    art.viewCount += 1;
    await art.save();

    res.json(art);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/martial-arts — admin create
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const art = await MartialArt.create(req.body);
    res.status(201).json(art);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/martial-arts/:id — admin update
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const art = await MartialArt.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!art) return res.status(404).json({ error: 'Not found' });
    res.json(art);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/martial-arts/:id — admin delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await MartialArt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
