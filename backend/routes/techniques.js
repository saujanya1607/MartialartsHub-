const express = require('express');
const router = express.Router();
const Technique = require('../models/Technique');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// GET /api/techniques
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, difficulty, search, martialArt, page = 1, limit = 24 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (martialArt) query.martialArts = martialArt;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Technique.find(query)
        .populate('martialArts', 'name slug')
        .skip(skip).limit(parseInt(limit))
        .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 }),
      Technique.countDocuments(query),
    ]);

    res.json({ data, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/techniques/categories
router.get('/categories', async (req, res) => {
  const categories = ['punches','kicks','elbows','knees','throws','takedowns',
                      'joint-locks','chokes','ground-fighting','weapon-techniques','defensive'];
  res.json(categories);
});

// GET /api/techniques/:slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const technique = await Technique.findOne({ slug: req.params.slug })
      .populate('martialArts', 'name slug country coverImage');

    if (!technique) return res.status(404).json({ error: 'Technique not found' });

    technique.viewCount += 1;
    await technique.save();

    res.json(technique);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /PUT /DELETE — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const technique = await Technique.create(req.body);
    res.status(201).json(technique);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const technique = await Technique.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!technique) return res.status(404).json({ error: 'Not found' });
    res.json(technique);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Technique.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
