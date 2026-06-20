import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { GiKatana, GiNinjaHeroStance, GiSwordsEmblem } from 'react-icons/gi';
import { FiZap, FiBook, FiVideo, FiMap, FiTarget, FiCpu } from 'react-icons/fi';

const FEATURES = [
  { icon: <GiSwordsEmblem size={32} />, title: 'Martial Arts Encyclopedia', desc: '500+ martial arts from every civilization, searchable by country, category, and style.', link: '/encyclopedia' },
  { icon: <FiTarget size={32} />,     title: 'Technique Database',          desc: '10,000+ techniques — punches, kicks, throws, grappling — with step-by-step guides.', link: '/techniques' },
  { icon: <FiCpu size={32} />,        title: 'AI Martial Arts Sensei',      desc: 'Chat with an AI tutor trained on all martial arts. Get learning paths, comparisons, and tips.', link: '/ai-sensei' },
  { icon: <FiVideo size={32} />,      title: 'Video Center',                desc: 'Discover YouTube tutorials and fights, filtered by martial art and technique.', link: '/videos' },
  { icon: <FiBook size={32} />,       title: 'Books Center',                desc: 'Curated library of martial arts books with links to official publishers.', link: '/books' },
  { icon: <FiMap size={32} />,        title: 'World Martial Arts Map',      desc: 'Interactive globe — click any country to discover its fighting traditions and history.', link: '/map' },
];

const STATS = [
  { value: '500+',   label: 'Martial Arts' },
  { value: '10K+',   label: 'Techniques' },
  { value: '100K+',  label: 'Videos' },
  { value: '50K+',   label: 'Books' },
];

const QUICK_ARTS = [
  { name: 'Muay Thai', country: '🇹🇭', slug: 'muay-thai' },
  { name: 'BJJ', country: '🇧🇷', slug: 'brazilian-jiu-jitsu' },
  { name: 'Karate', country: '🇯🇵', slug: 'karate' },
  { name: 'Kalaripayattu', country: '🇮🇳', slug: 'kalaripayattu' },
  { name: 'Wing Chun', country: '🇨🇳', slug: 'wing-chun' },
  { name: 'Taekwondo', country: '🇰🇷', slug: 'taekwondo' },
  { name: 'Krav Maga', country: '🇮🇱', slug: 'krav-maga' },
  { name: 'Capoeira', country: '🇧🇷', slug: 'capoeira' },
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>MartialHub — World's Ultimate Martial Arts Platform</title>
        <meta name="description" content="Learn, explore, and master martial arts from around the world." />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="hero-bg min-h-screen flex items-center justify-center text-center px-4"
        style={{
          background: `var(--hero-overlay), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='none'/%3E%3Ccircle cx='30' cy='30' r='1' fill='rgba(255,255,255,0.03)'/%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
        }}
      >
        <div className="hero-content max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8"
            >
              <GiKatana style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                The World's Martial Arts Library
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-6 leading-none">
              <span style={{ color: 'var(--text-primary)' }}>Master</span>{' '}
              <span className="text-glow" style={{ color: 'var(--accent)' }}>Every</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>Martial Art</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Explore techniques, books, videos, and martial traditions from every civilization on Earth.
              Guided by your personal AI Sensei.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link to="/encyclopedia" className="btn-primary text-base flex items-center gap-2">
                <GiSwordsEmblem /> Explore Martial Arts
              </Link>
              <Link to="/ai-sensei" className="btn-ghost text-base flex items-center gap-2">
                <FiZap /> Ask AI Sensei
              </Link>
              <Link to="/videos" className="btn-ghost text-base flex items-center gap-2">
                <FiVideo /> Watch Techniques
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2"
                 style={{ borderColor: 'var(--card-border)' }}>
              <motion.div className="w-1.5 h-3 rounded-full" style={{ background: 'var(--accent)' }}
                animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="text-center"
            >
              <div className="font-display text-4xl font-black text-glow" style={{ color: 'var(--accent)' }}>{s.value}</div>
              <div className="text-sm mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── QUICK EXPLORE ─────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>QUICK EXPLORE</p>
            <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Popular Martial Arts</h2>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {QUICK_ARTS.map(art => (
              <Link key={art.slug} to={`/encyclopedia/${art.slug}`}
                className="glass tag px-4 py-2.5 rounded-full flex items-center gap-2 card-hover text-sm font-medium transition-all"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>{art.country}</span> {art.name}
              </Link>
            ))}
            <Link to="/encyclopedia" className="tag px-4 py-2.5 rounded-full text-sm font-medium">
              + 500 more →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>EVERYTHING YOU NEED</p>
            <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>One Platform. All Arts.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              >
                <Link to={feature.link} className="glass block p-6 rounded-2xl card-hover h-full">
                  <div className="mb-4" style={{ color: 'var(--accent)' }}>{feature.icon}</div>
                  <h3 className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SENSEI CTA ─────────────────────────────────────── */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="ai-orb mx-auto mb-8"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true }}
          />
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Meet Your <span style={{ color: 'var(--accent)' }}>AI Sensei</span>
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Ask anything. Compare styles. Get a personalized training plan. Your AI tutor knows every martial art ever taught.
          </p>
          <div className="glass rounded-2xl p-6 mb-8 text-left">
            {[
              'What is the difference between Judo and Brazilian Jiu-Jitsu?',
              'Create a 12-week Muay Thai training plan for beginners.',
              'Which martial art is best for self-defense in real situations?',
            ].map(q => (
              <div key={q} className="flex items-start gap-3 mb-4 last:mb-0">
                <span style={{ color: 'var(--accent)' }}>›</span>
                <span className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>{q}</span>
              </div>
            ))}
          </div>
          <Link to="/ai-sensei" className="btn-primary text-base">
            Start Training with AI Sensei
          </Link>
        </div>
      </section>
    </>
  );
}
