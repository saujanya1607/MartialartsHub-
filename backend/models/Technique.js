const mongoose = require('mongoose');

const techniqueSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  slug:           { type: String, required: true, unique: true, lowercase: true },
  category:       {
    type: String,
    required: true,
    enum: ['punches','kicks','elbows','knees','throws','takedowns',
           'joint-locks','chokes','ground-fighting','weapon-techniques','defensive'],
  },
  description:    { type: String, required: true },
  difficulty:     { type: String, enum: ['beginner','intermediate','advanced'] },
  martialArts:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'MartialArt' }],
  commonMistakes: [String],
  learningTips:   [String],
  steps:          [{ order: Number, instruction: String }],
  coverImage:     { type: String, default: '' },
  tags:           [String],
  viewCount:      { type: Number, default: 0 },
}, { timestamps: true });

techniqueSchema.index({ name: 'text', description: 'text', tags: 'text' });
techniqueSchema.index({ category: 1, difficulty: 1 });

module.exports = mongoose.model('Technique', techniqueSchema);
