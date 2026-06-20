/**
 * Seed script — populates MongoDB with the full martial arts, techniques,
 * and books catalog described in the project specification.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const MartialArt = require('../models/MartialArt');
const Technique = require('../models/Technique');
const Book = require('../models/Book');
const { martialArts, techniques } = require('./fullData');
const { books } = require('./fullBooks');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await MartialArt.deleteMany({});
    await Technique.deleteMany({});
    await Book.deleteMany({});
    console.log('Cleared existing data');

    const createdTechniques = await Technique.insertMany(techniques);
    console.log(`Seeded ${createdTechniques.length} techniques`);

    const createdArts = await MartialArt.insertMany(martialArts);
    console.log(`Seeded ${createdArts.length} martial arts`);

    // Build a slug → ObjectId lookup so books can reference martial arts correctly.
    const artBySlug = {};
    createdArts.forEach(a => { artBySlug[a.slug] = a._id; });

    const booksWithRefs = books.map(({ martialArtSlugs, ...rest }) => ({
      ...rest,
      martialArts: (martialArtSlugs || [])
        .map(slug => artBySlug[slug])
        .filter(Boolean),
    }));

    const createdBooks = await Book.insertMany(booksWithRefs);
    console.log(`Seeded ${createdBooks.length} books`);

    console.log('✅ Seed complete!');
    console.log(`   Martial Arts: ${createdArts.length}`);
    console.log(`   Techniques:   ${createdTechniques.length}`);
    console.log(`   Books:        ${createdBooks.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
