const express = require('express');
const router = express.Router();
const MartialArt = require('../models/MartialArt');
const Technique = require('../models/Technique');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [arts, techniques, books, users] = await Promise.all([
      MartialArt.countDocuments(),
      Technique.countDocuments(),
      Book.countDocuments(),
      User.countDocuments(),
    ]);
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt role');
    res.json({ arts, techniques, books, users, recentUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/generate-summary — AI generate summary for martial art
router.post('/generate-summary', async (req, res) => {
  try {
    const { name, type } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let prompt;
    if (type === 'martial-art') {
      prompt = `Write a concise encyclopedia-style description for the martial art "${name}". 
Include: origin, history summary (2-3 sentences), philosophy, what makes it unique. 
Under 200 words. Professional tone.`;
    } else {
      prompt = `Write a concise description for the martial arts technique "${name}".
Include: what it is, how it's performed briefly, which martial arts use it. Under 150 words.`;
    }

    const result = await model.generateContent(prompt);
    res.json({ summary: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/make-admin — elevate user to admin
router.post('/make-admin', async (req, res) => {
  try {
    const { email, secret } = req.body;
    if (secret !== process.env.ADMIN_SECRET) return res.status(403).json({ error: 'Invalid secret' });
    const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `${user.email} is now an admin`, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
