# 🥋 MartialHub — Martial Arts Learning Platform

A complete full-stack web application for exploring martial arts worldwide — built to convert into a mobile app later (React → React Native ready).

## ✨ Features

- **Encyclopedia** — 500+ martial arts, searchable by country, category, difficulty
- **Technique Database** — step-by-step technique guides with common mistakes & tips
- **AI Martial Arts Sensei** — Gemini-powered chat tutor (full page + floating widget)
- **Video Center** — YouTube Data API search for tutorials
- **Books Center** — curated martial arts library
- **Interactive World Map** — click a country, see its martial arts
- **Personal Tracker** — save arts/techniques, set goals, earn XP & levels
- **6 Visual Themes** × dark/light mode — Ancient Colosseum, Frozen Sanctuary, Astral Tree, Sacred Peak, Cybernetic Arena, Gladiator Pit
- **Admin Dashboard** — add content, AI-generate descriptions, view stats
- **Auth** — Email/password + Google OAuth, JWT-based

## 🏗️ Tech Stack

**Frontend:** React, React Router, Tailwind CSS, Framer Motion, Axios
**Backend:** Node.js, Express, MongoDB (Atlas), Mongoose, Passport (JWT + Google OAuth)
**AI:** Google Gemini API (`gemini-1.5-flash`)
**Video:** YouTube Data API v3

## 📁 Project Structure

```
martial-arts-hub/
├── backend/
│   ├── config/passport.js       # JWT + Google OAuth strategies
│   ├── middleware/auth.js       # protect, adminOnly, optionalAuth
│   ├── models/                  # User, MartialArt, Technique, Book
│   ├── routes/                  # auth, martialArts, techniques, ai, videos, books, tracker, map, admin, users
│   ├── utils/seedData.js        # sample data seeder
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/ (Navbar, Footer)
    │   │   ├── ui/ (Cards, Particles)
    │   │   └── ai-tutor/ (AISenseiFloating)
    │   ├── context/ (ThemeContext, AuthContext)
    │   ├── pages/ (Home, Encyclopedia, Techniques, Videos, Books, Map, Tracker, AI Sensei, Auth, Admin)
    │   ├── utils/api.js
    │   ├── styles/globals.css   # all 6 themes
    │   └── App.jsx
    ├── package.json
    └── .env.example
```

## 🚀 Setup Instructions

### 1. MongoDB Atlas
1. Create a free cluster at https://cloud.mongodb.com
2. Create a database user and get your connection string
3. Whitelist your IP (or `0.0.0.0/0` for development)

### 2. Google Gemini API Key
1. Go to https://aistudio.google.com/app/apikey
2. Create an API key

### 3. YouTube Data API Key
1. Go to https://console.cloud.google.com
2. Create a project → Enable "YouTube Data API v3"
3. Create credentials → API Key

### 4. Google OAuth (optional, for "Sign in with Google")
1. In Google Cloud Console → Credentials → Create OAuth Client ID
2. Set authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

### 5. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env with MongoDB URI, Gemini key, YouTube key, JWT secret, Google OAuth keys
npm run seed     # populates sample data
npm run dev      # starts on http://localhost:5000
```

### 6. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm start        # starts on http://localhost:3000
```

### 7. Create Your First Admin
After registering a normal account, call this endpoint once (e.g. via Postman or curl) to promote yourself:
```bash
curl -X POST http://localhost:5000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","secret":"YOUR_ADMIN_SECRET_FROM_ENV"}'
```

## 📱 Future App Conversion

This frontend uses React with simple component structure — no browser-only APIs beyond standard fetch/localStorage — making it straightforward to port to **React Native** later:
- Replace `react-router-dom` → `react-navigation`
- Replace Tailwind classes → `StyleSheet` or `nativewind`
- Replace `<img>`/`<a>` → `<Image>`/`<TouchableOpacity>`
- Backend API requires **zero changes** — it already serves JSON over REST

## 🔐 Security Notes
- Passwords hashed with bcrypt
- JWT auth with 7-day expiry (configurable)
- Rate limiting on all routes, stricter on AI endpoints
- Helmet.js security headers
- Input validation via express-validator

## 📝 Adding Content at Scale
The admin panel lets you add martial arts one at a time with AI-assisted descriptions. For bulk seeding hundreds of martial arts, extend `backend/utils/seedData.js` with your full dataset and re-run `npm run seed`.
