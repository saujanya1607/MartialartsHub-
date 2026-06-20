import { Link } from 'react-router-dom';
import { GiKatana } from 'react-icons/gi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <GiKatana size={48} className="mb-4" style={{ color: 'var(--accent)' }} />
      <h1 className="font-display text-5xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>404</h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>This page has left the dojo.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );
}
