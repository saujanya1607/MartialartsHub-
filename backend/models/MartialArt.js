const mongoose = require('mongoose');

const martialArtSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true, unique: true },
  slug:          { type: String, required: true, unique: true, lowercase: true },
  origin:        { type: String, required: true },
  country:       { type: String, required: true },
  countryCode:   { type: String },
  category:      { type: String, enum: ['striking', 'grappling', 'weapons', 'mixed', 'internal', 'self-defense', 'sport'] },
  type:          { type: String, enum: ['traditional', 'modern', 'hybrid'] },
  difficulty:    { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all-levels'] },
  usesWeapons:   { type: Boolean, default: false },
  history:       { type: String, required: true },
  philosophy:    { type: String },
  description:   { type: String, required: true },
  techniques:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technique' }],
  weapons:       [String],
  learningPath:  [{ stage: String, description: String, duration: String }],
  relatedArts:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'MartialArt' }],
  famousPractitioners: [{ name: String, description: String }],
  coverImage:    { type: String, default: '' },
  tags:          [String],
  isFeatured:    { type: Boolean, default: false },
  viewCount:     { type: Number, default: 0 },
}, { timestamps: true });

martialArtSchema.index({ name: 'text', description: 'text', tags: 'text' });
martialArtSchema.index({ country: 1, category: 1, difficulty: 1 });

module.exports = mongoose.model('MartialArt', martialArtSchema);
