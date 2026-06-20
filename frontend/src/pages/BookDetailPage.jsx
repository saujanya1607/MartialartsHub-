import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { LoadingSpinner } from '../components/ui/Cards';
import { FiArrowLeft, FiUser, FiBookOpen, FiTag, FiGlobe, FiHash, FiAlertCircle } from 'react-icons/fi';

function BookNotFound() {
  return (
    <div className="pt-32 pb-20 px-4 text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">📖</div>
      <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Book Not Found
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        This book may have been removed, or the link you followed is incorrect.
      </p>
      <Link to="/books" className="btn-primary">
        <FiArrowLeft style={{ display: 'inline', marginRight: 6 }} /> Back to Library
      </Link>
    </div>
  );
}

function BookDetailError({ onRetry }) {
  return (
    <div className="pt-32 pb-20 px-4 text-center max-w-md mx-auto">
      <FiAlertCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
      <h1 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        Something Went Wrong
      </h1>
      <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
        We couldn't load this book right now. Please try again.
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="btn-primary">Try Again</button>
        <Link to="/books" className="btn-ghost">Back to Library</Link>
      </div>
    </div>
  );
}

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | not-found | error

  const load = () => {
    setStatus('loading');
    api.get(`/books/${id}`)
      .then(({ data }) => {
        setBook(data);
        setStatus('ready');
        return api.get(`/books/${id}/related`).then(({ data }) => setRelated(data)).catch(() => setRelated([]));
      })
      .catch((err) => {
        if (err.response?.status === 404) setStatus('not-found');
        else setStatus('error');
      });
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  if (status === 'loading') return <div className="pt-24"><LoadingSpinner /></div>;
  if (status === 'not-found') return <BookNotFound />;
  if (status === 'error') return <BookDetailError onRetry={load} />;
  if (!book) return <BookNotFound />;

  const martialArtNames = (book.martialArts || []).map(a => a.name);

  return (
    <>
      <Helmet><title>{book.title} — MartialHub Library</title></Helmet>

      <div className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
        {/* Back link */}
        <button onClick={() => navigate('/books')} className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <FiArrowLeft /> Back to Library
        </button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-[280px_1fr] gap-10 mb-12">
          {/* Cover */}
          <div>
            <div
              className="w-full aspect-[2/3] rounded-2xl flex items-center justify-center text-6xl glass"
              style={{ background: book.coverImage ? `url(${book.coverImage}) center/cover` : 'var(--bg-secondary)' }}
            >
              {!book.coverImage && '📖'}
            </div>
          </div>

          {/* Main info */}
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {book.difficulty && <span className="tag">{book.difficulty}</span>}
              {book.category && <span className="tag">{book.category}</span>}
              {martialArtNames.map(name => <span key={name} className="tag">{name}</span>)}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {book.title}
            </h1>
            <p className="flex items-center gap-2 text-lg mb-6" style={{ color: 'var(--accent)' }}>
              <FiUser size={16} /> {book.author}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {book.publishYear && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Published</p>
                  <p style={{ color: 'var(--text-primary)' }}>{book.publishYear}</p>
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <FiGlobe size={11} /> Language
                </p>
                <p style={{ color: 'var(--text-primary)' }}>{book.language || 'English'}</p>
              </div>
              {book.publisher && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Publisher</p>
                  <p style={{ color: 'var(--text-primary)' }}>{book.publisher}</p>
                </div>
              )}
              {book.isbn && (
                <div>
                  <p className="text-xs uppercase tracking-wide mb-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <FiHash size={11} /> ISBN
                  </p>
                  <p style={{ color: 'var(--text-primary)' }}>{book.isbn}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap">
              <a href="#overview" className="btn-primary text-sm flex items-center gap-2">
                <FiBookOpen size={14} /> Read Overview
              </a>
              <a href="#author" className="btn-ghost text-sm flex items-center gap-2">
                <FiUser size={14} /> View Author
              </a>
              {book.buyUrl && (
                <a href={book.buyUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
                  Find This Book
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Overview */}
        <section id="overview" className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <FiBookOpen size={18} /> Overview
          </h2>
          <p className="leading-relaxed" style={{ color: book.description ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {book.description || 'Information coming soon for this title.'}
          </p>
        </section>

        {/* Key Topics */}
        {book.keyTopics?.length > 0 && (
          <section className="glass rounded-2xl p-6 mb-8">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              <FiTag size={18} /> Key Topics Covered
            </h2>
            <div className="flex flex-wrap gap-2">
              {book.keyTopics.map((topic, i) => (
                <span key={i} className="tag px-3 py-1.5">{topic}</span>
              ))}
            </div>
          </section>
        )}

        {/* Author */}
        <section id="author" className="glass rounded-2xl p-6 mb-8">
          <h2 className="font-display text-xl font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <FiUser size={18} /> About the Author
          </h2>
          <p style={{ color: book.authorBio ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {book.authorBio || `Information coming soon about ${book.author}.`}
          </p>
        </section>

        {/* Related Books */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Related Books</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(r => (
                <Link key={r._id} to={`/books/${r._id}`} className="glass rounded-xl p-3 card-hover">
                  <div className="h-24 mb-2 rounded-lg flex items-center justify-center text-2xl"
                       style={{ background: r.coverImage ? `url(${r.coverImage}) center/cover` : 'var(--bg-secondary)' }}>
                    {!r.coverImage && '📖'}
                  </div>
                  <p className="text-xs font-medium line-clamp-2" style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
