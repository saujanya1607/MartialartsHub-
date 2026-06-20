const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET /api/tracker — get user's full tracker data
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedMartialArts', 'name slug country coverImage category')
      .populate('savedTechniques', 'name slug category difficulty')
      .populate('savedBooks', 'title author coverImage');
    res.json({
      savedMartialArts: user.savedMartialArts,
      savedTechniques: user.savedTechniques,
      savedBooks: user.savedBooks,
      savedVideos: user.savedVideos,
      learningGoals: user.learningGoals,
      achievements: user.achievements,
      xp: user.xp,
      level: user.level,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tracker/save-art
router.post('/save-art', protect, async (req, res) => {
  try {
    const { artId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.savedMartialArts.indexOf(artId);
    if (idx === -1) {
      user.savedMartialArts.push(artId);
      user.xp += 10;
    } else {
      user.savedMartialArts.splice(idx, 1);
    }
    await user.save();
    res.json({ saved: idx === -1, xp: user.xp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tracker/save-technique
router.post('/save-technique', protect, async (req, res) => {
  try {
    const { techniqueId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.savedTechniques.indexOf(techniqueId);
    if (idx === -1) {
      user.savedTechniques.push(techniqueId);
      user.xp += 5;
    } else {
      user.savedTechniques.splice(idx, 1);
    }
    await user.save();
    res.json({ saved: idx === -1, xp: user.xp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tracker/save-video
router.post('/save-video', protect, async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.savedVideos.indexOf(videoId);
    if (idx === -1) user.savedVideos.push(videoId);
    else user.savedVideos.splice(idx, 1);
    await user.save();
    res.json({ saved: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tracker/save-book
router.post('/save-book', protect, async (req, res) => {
  try {
    const { bookId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.savedBooks.indexOf(bookId);
    if (idx === -1) user.savedBooks.push(bookId);
    else user.savedBooks.splice(idx, 1);
    await user.save();
    res.json({ saved: idx === -1 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tracker/goal
router.post('/goal', protect, async (req, res) => {
  try {
    const { goal, targetDate } = req.body;
    const user = await User.findById(req.user._id);
    user.learningGoals.push({ goal, targetDate, completed: false });
    await user.save();
    res.json(user.learningGoals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tracker/goal/:id
router.patch('/goal/:goalId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const goal = user.learningGoals.id(req.params.goalId);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    goal.completed = req.body.completed ?? goal.completed;
    goal.goal = req.body.goal ?? goal.goal;
    if (req.body.completed && !goal.completed) user.xp += 50;
    await user.save();
    res.json(user.learningGoals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
