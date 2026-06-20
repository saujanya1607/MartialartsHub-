import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function MartialArtCard({ art }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Link to={`/encyclopedia/${art.slug}`} className="glass block rounded-2xl overflow-hidden card-hover h-full">
        <div
          className="h-36 flex items-center justify-center text-4xl"
          style={{ background: art.coverImage ? `url(${art.coverImage}) center/cover` : 'var(--bg-secondary)' }}
        >
          {!art.coverImage && '🥋'}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>{art.name}</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{art.country}</p>
          <div className="flex gap-2 flex-wrap">
            {art.category && <span className="tag text-xs">{art.category}</span>}
            {art.difficulty && <span className="tag text-xs">{art.difficulty}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TechniqueCard({ technique }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Link to={`/techniques/${technique.slug}`} className="glass block rounded-2xl p-5 card-hover h-full">
        <h3 className="font-display font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{technique.name}</h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{technique.description}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="tag text-xs">{technique.category}</span>
          {technique.difficulty && <span className="tag text-xs">{technique.difficulty}</span>}
        </div>
      </Link>
    </motion.div>
  );
}

export function BookCard({ book }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <Link
        to={`/books/${book._id}`}
        className="glass rounded-2xl p-5 card-hover h-full flex flex-col"
      >
        <div className="h-40 mb-4 rounded-lg flex items-center justify-center text-4xl"
             style={{ background: book.coverImage ? `url(${book.coverImage}) center/cover` : 'var(--bg-secondary)' }}>
          {!book.coverImage && '📖'}
        </div>
        <h3 className="font-display font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{book.title}</h3>
        <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>by {book.author}</p>
        <p className="text-sm mb-3 line-clamp-2 flex-1" style={{ color: 'var(--text-secondary)' }}>
          {book.description || 'Information coming soon.'}
        </p>
        <div className="flex gap-2 flex-wrap">
          {book.difficulty && <span className="tag text-xs">{book.difficulty}</span>}
          {book.category && <span className="tag text-xs">{book.category}</span>}
        </div>
      </Link>
    </motion.div>
  );
}

export function VideoCard({ video }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden card-hover"
    >
      <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
        <div className="relative">
          <img src={video.thumbnail} alt={video.title} className="w-full h-44 object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--accent)' }}>▶</div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-primary)' }}>{video.title}</h3>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{video.channel}</p>
        </div>
      </a>
    </motion.div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="ai-orb" style={{ width: 40, height: 40 }} />
    </div>
  );
}

export function EmptyState({ message = 'Nothing found.' }) {
  return (
    <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>
      <div className="text-4xl mb-3">🥋</div>
      <p>{message}</p>
    </div>
  );
}
