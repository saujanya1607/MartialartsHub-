const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const achievementSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, minlength: 6 },
  googleId:     { type: String, sparse: true },
  avatar:       { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  isVerified:   { type: Boolean, default: false },
  role:         { type: String, enum: ['user', 'admin'], default: 'user' },

  // Theme preferences
  theme:        { type: String, default: 'ancient-colosseum' },
  colorMode:    { type: String, enum: ['dark', 'light', 'auto'], default: 'dark' },

  // Learning tracker
  savedMartialArts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'MartialArt' }],
  savedTechniques:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technique' }],
  savedVideos:       [{ type: String }],
  savedBooks:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  learningGoals:     [{ goal: String, targetDate: Date, completed: Boolean }],
  achievements:      [achievementSchema],
  xp:                { type: Number, default: 0 },
  level:             { type: Number, default: 1 },

  lastActive: { type: Date, default: Date.now },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.googleId;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
