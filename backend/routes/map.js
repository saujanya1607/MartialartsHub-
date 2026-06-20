const express = require('express');
const router = express.Router();
const MartialArt = require('../models/MartialArt');

// GET /api/map — returns grouped by country for interactive map
router.get('/', async (req, res) => {
  try {
    const arts = await MartialArt.find({})
      .select('name slug country countryCode category coverImage');

    // Group by country
    const byCountry = {};
    arts.forEach(art => {
      if (!byCountry[art.country]) {
        byCountry[art.country] = {
          country: art.country,
          countryCode: art.countryCode,
          arts: [],
        };
      }
      byCountry[art.country].arts.push({ name: art.name, slug: art.slug, category: art.category, coverImage: art.coverImage });
    });

    res.json(Object.values(byCountry));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/map/:country
router.get('/:country', async (req, res) => {
  try {
    const arts = await MartialArt.find({ country: new RegExp(req.params.country, 'i') })
      .select('name slug category difficulty coverImage description');
    res.json(arts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
