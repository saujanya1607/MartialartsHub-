import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, THEMES } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut,
  FiSettings, FiBook, FiVideo, FiMap, FiTarget, FiCpu,
} from 'react-icons/fi';
import { GiKatana } from 'react-icons/gi';

const NAV_LINKS = [
  { to: '/encyclopedia', label: 'Encyclopedia', icon: <GiKatana /> },
  { to: '/techniques',   label: 'Techniques',   icon: <FiTarget /> },
  { to: '/videos',       label: 'Videos',       icon: <FiVideo /> },
  { to: '/books',        label: 'Books',        icon: <FiBook /> },
  { to: '/map',          label: 'World Map',    icon: <FiMap /> },
  { to: '/ai-sensei',    label: 'AI Sensei',    icon: <FiCpu /> },
];

export default function Navbar() {
  const { theme, colorMode, setTheme, toggleMode, themes } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GiKatana style={{ color: 'var(--accent)', fontSize: '1.8rem' }} />
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>
            MARTIAL<span style={{ color: 'var(--accent)' }}>HUB</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-accent'
                    : 'hover:text-accent'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
              })}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Theme Picker Button */}
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="glass px-3 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ color: 'var(--accent)' }}
            title="Change theme"
          >
            {themes.find(t => t.id === theme)?.emoji} Theme
          </button>

          {/* Dark/Light Toggle */}
          <button
            onClick={toggleMode}
            className="glass p-2.5 rounded-lg transition-all"
            style={{ color: 'var(--accent)' }}
            title="Toggle color mode"
          >
            {colorMode === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="glass flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ color: 'var(--text-primary)' }}
              >
                {user.avatar
                  ? <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" />
                  : <FiUser size={16} />
                }
                <span className="text-sm hidden md:block">{user.name.split(' ')[0]}</span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="glass-modal absolute right-0 top-12 w-48 rounded-xl p-2 z-50"
                  >
                    <Link to="/tracker" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: 'var(--text-primary)' }} onClick={() => setUserMenuOpen(false)}>
                      <FiTarget size={14} /> My Tracker
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm" style={{ color: 'var(--accent)' }} onClick={() => setUserMenuOpen(false)}>
                        <FiSettings size={14} /> Admin Panel
                      </Link>
                    )}
                    <div className="divider-accent my-1" />
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/'); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm w-full text-left"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <FiLogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden glass p-2.5 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: 'var(--accent)' }}
          >
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Theme Selector Dropdown */}
      <AnimatePresence>
        {themeOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="glass-modal absolute top-20 left-1/2 -translate-x-1/2 rounded-2xl p-6 z-50 w-[90vw] max-w-2xl"
          >
            <h3 className="font-display text-center mb-4 text-lg" style={{ color: 'var(--accent)' }}>
              Choose Your Arena
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setThemeOpen(false); }}
                  className="glass rounded-xl p-4 text-left transition-all card-hover"
                  style={{
                    borderColor: theme === t.id ? t.accentPreview : undefined,
                    boxShadow: theme === t.id ? `0 0 15px ${t.accentPreview}40` : undefined,
                  }}
                >
                  <div className="text-2xl mb-2">{t.emoji}</div>
                  <div className="font-display text-sm font-semibold" style={{ color: theme === t.id ? t.accentPreview : 'var(--text-primary)' }}>
                    {t.name}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</div>
                  {theme === t.id && (
                    <div className="mt-2 text-xs font-bold" style={{ color: t.accentPreview }}>✓ Active</div>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setThemeOpen(false)} className="w-full mt-4 btn-ghost text-sm">Close</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-nav border-t px-4 py-4"
            style={{ borderColor: 'var(--card-border)' }}
          >
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setMobileOpen(false)}
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
