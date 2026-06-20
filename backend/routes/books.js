const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// GET /api/books
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, martialArt, difficulty, category, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) query.$text = { $search: search };
    if (martialArt) query.martialArts = martialArt;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Book.find(query)
        .populate('martialArts', 'name slug')
        .skip(skip).limit(parseInt(limit))
        .sort(search ? { score: { $meta: 'textScore' } } : { title: 1 }),
      Book.countDocuments(query),
    ]);

    res.json({ data, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Books list error:', err.message);
    res.status(500).json({ error: 'Could not load books right now.' });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const data = await Book.find({ isFeatured: true }).limit(8);
    res.json(data);
  } catch (err) {
    console.error('Featured books error:', err.message);
    res.status(500).json({ error: 'Could not load featured books.' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ error: 'Book not found' });
    }
    const book = await Book.findById(req.params.id).populate('martialArts', 'name slug');
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error('Book detail error:', err.message);
    res.status(500).json({ error: 'Could not load this book right now.' });
  }
});

// GET /api/books/:id/related — books sharing a martial art or category
router.get('/:id/related', async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.json([]);
    }
    const book = await Book.findById(req.params.id);
    if (!book) return res.json([]);

    const query = {
      _id: { $ne: book._id },
      $or: [
        { martialArts: { $in: book.martialArts } },
        { category: book.category },
      ],
    };

    const related = await Book.find(query).limit(4).populate('martialArts', 'name slug');
    res.json(related);
  } catch (err) {
    console.error('Related books error:', err.message);
    res.json([]);
  }
});

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
