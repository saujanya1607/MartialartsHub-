const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('dotenv').config();

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'AI rate limit reached, please wait a moment.' }
});
app.use('/api/ai/', aiLimiter);

// ─── General Middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(passport.initialize());

// ─── Passport Config ──────────────────────────────────────────────────────────
require('./config/passport')(passport);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/martial-arts', require('./routes/martialArts'));
app.use('/api/techniques',  require('./routes/techniques'));
app.use('/api/ai',          require('./routes/ai'));
app.use('/api/videos',      require('./routes/videos'));
app.use('/api/books',       require('./routes/books'));
app.use('/api/tracker',     require('./routes/tracker'));
app.use('/api/map',         require('./routes/map'));
app.use('/api/admin',       require('./routes/admin'));
app.use('/api/users',       require('./routes/users'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), environment: process.env.NODE_ENV });
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ─── Startup Validation ────────────────────────────────────────────────────────
// Catches the #1 setup mistake: missing or misplaced .env file.
const REQUIRED_ENV_VARS = ['MONGODB_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('\n❌ STARTUP FAILED — missing required environment variables:\n');
  missing.forEach(key => console.error(`   • ${key}`));
  console.error(`
This usually means your .env file is missing or in the wrong place.

To fix:
  1. Make sure you are inside the "backend" folder.
  2. Run:  ls -la   (look for a file literally named ".env" — not ".env.example")
  3. If it's missing, run:  cp .env.example .env
  4. Open .env and fill in real values for: ${REQUIRED_ENV_VARS.join(', ')}
  5. Restart with:  npm run dev
`);
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY is not set — AI Sensei chat will not work until you add it to .env');
}
if (!process.env.YOUTUBE_API_KEY) {
  console.warn('⚠️  YOUTUBE_API_KEY is not set — Video search will not work until you add it to .env');
}

// ─── Database & Server Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('\n❌ MongoDB connection error:', err.message);
    console.error(`
This means MONGODB_URI in your .env was found, but MongoDB rejected it. Common causes:
  • Wrong username/password in the connection string
  • Your IP isn't whitelisted in MongoDB Atlas → Network Access → Add IP Address → "Allow access from anywhere"
  • The connection string is missing the database name or has a typo
`);
    process.exit(1);
  });

module.exports = app;
