import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch } from 'react-icons/fi';
import api from '../utils/api';
import { BookCard, LoadingSpinner, EmptyState } from '../components/ui/Cards';

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'all-levels'];

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [martialArts, setMartialArts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [martialArt, setMartialArt] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 18 };
      if (search) params.search = search;
      if (martialArt) params.martialArt = martialArt;
      if (difficulty) params.difficulty = difficulty;
      const { data } = await api.get('/books', { params });
      setBooks(data.data);
      setPages(data.pages);
    } catch { setBooks([]); }
    finally { setLoading(false); }
  }, [search, martialArt, difficulty, page]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  useEffect(() => {
    api.get('/martial-arts', { params: { limit: 200 } })
      .then(({ data }) => setMartialArts(data.data))
      .catch(() => setMartialArts([]));
  }, []);

  const updateFilter = (setter) => (e) => { setter(e.target.value); setPage(1); };

  return (
    <>
      <Helmet><title>Martial Arts Books — MartialHub</title></Helmet>
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>BOOKS CENTER</p>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>The Martial Library</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Curated books, manuals, and philosophy texts</p>
        </div>

        <div className="max-w-2xl mx-auto mb-6 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input value={search} onChange={updateFilter(setSearch)}
            placeholder="Search books by title or author..." className="input-custom pl-12" />
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <select value={martialArt} onChange={updateFilter(setMartialArt)} className="input-custom w-auto">
            <option value="">All Martial Arts</option>
            {martialArts.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <select value={difficulty} onChange={updateFilter(setDifficulty)} className="input-custom w-auto">
            <option value="">All Levels</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {loading ? <LoadingSpinner /> : books.length === 0 ? <EmptyState message="No books found." /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {books.map(b => <BookCard key={b._id} book={b} />)}
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={p === page ? 'btn-primary px-4 py-2 text-sm' : 'btn-ghost px-4 py-2 text-sm'}>{p}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
