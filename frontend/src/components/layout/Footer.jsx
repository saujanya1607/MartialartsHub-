import { Link } from 'react-router-dom';
import { GiKatana } from 'react-icons/gi';
import { FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Encyclopedia', to: '/encyclopedia' },
      { label: 'Techniques', to: '/techniques' },
      { label: 'World Map', to: '/map' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Videos', to: '/videos' },
      { label: 'Books', to: '/books' },
      { label: 'AI Sensei', to: '/ai-sensei' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Tracker', to: '/tracker' },
      { label: 'Sign In', to: '/login' },
      { label: 'Create Account', to: '/register' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12" style={{ borderTop: '1px solid var(--card-border)', background: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <GiKatana style={{ color: 'var(--accent)' }} size={24} />
            <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
              MARTIAL<span style={{ color: 'var(--accent)' }}>HUB</span>
            </span>
          </div>
          <p className="text-sm max-w-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
            The world's most complete martial arts learning platform — encyclopedia, AI tutor, videos, and books, all in one place.
          </p>
          <div className="flex gap-3">
            {[FiGithub, FiTwitter, FiInstagram].map((Icon, i) => (
              <a key={i} href="#" className="glass p-2 rounded-lg" style={{ color: 'var(--accent)' }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map(col => (
          <div key={col.title}>
            <h4 className="font-display text-sm font-semibold mb-3" style={{ color: 'var(--accent)' }}>{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm" style={{ color: 'var(--text-secondary)' }}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="divider-accent max-w-7xl mx-auto" />
      <div className="text-center pb-6 text-xs" style={{ color: 'var(--text-secondary)' }}>
        © {new Date().getFullYear()} MartialHub. Built for martial artists, by martial artists.
      </div>
    </footer>
  );
}
