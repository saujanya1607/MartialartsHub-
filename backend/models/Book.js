const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  author:       { type: String, required: true },
  description:  { type: String },
  publisher:    { type: String },
  publishYear:  { type: Number },
  isbn:         { type: String },
  coverImage:   { type: String, default: '' },
  martialArts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'MartialArt' }],
  category:     { type: String },
  difficulty:   { type: String, enum: ['beginner','intermediate','advanced','all-levels'] },
  language:     { type: String, default: 'English' },
  keyTopics:    [String],
  authorBio:    { type: String },
  publisherUrl: { type: String },
  buyUrl:       { type: String },
  isFeatured:   { type: Boolean, default: false },
  tags:         [String],
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);
