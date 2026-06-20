import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch, FiFilter } from 'react-icons/fi';
import api from '../utils/api';
import { MartialArtCard, LoadingSpinner, EmptyState } from '../components/ui/Cards';

const CATEGORIES = ['striking', 'grappling', 'weapons', 'mixed', 'internal', 'self-defense', 'sport'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'all-levels'];

export default function EncyclopediaPage() {
  const [arts, setArts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '', country: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchArts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 18 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/martial-arts', { params });
      setArts(data.data);
      setPages(data.pages);
    } catch {
      setArts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchArts(); }, [fetchArts]);

  useEffect(() => {
    api.get('/martial-arts/countries').then(({ data }) => setCountries(data)).catch(() => {});
  }, []);

  const updateFilter = (key, value) => { setFilters(prev => ({ ...prev, [key]: value })); setPage(1); };

  return (
    <>
      <Helmet><title>Martial Arts Encyclopedia — MartialHub</title></Helmet>

      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>ENCYCLOPEDIA</p>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            500+ Martial Arts, One Library
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>From ancient traditions to modern combat sports</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            placeholder="Search martial arts..."
            className="input-custom pl-12"
          />
        </div>

        {/* Filter Toggle (mobile) */}
        <div className="flex justify-center mb-4">
          <button onClick={() => setShowFilters(!showFilters)} className="btn-ghost text-sm flex items-center gap-2 lg:hidden">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Filters */}
        <div className={`flex flex-wrap gap-3 justify-center mb-10 ${showFilters ? '' : 'hidden lg:flex'}`}>
          <select value={filters.category} onChange={e => updateFilter('category', e.target.value)} className="input-custom w-auto">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.difficulty} onChange={e => updateFilter('difficulty', e.target.value)} className="input-custom w-auto">
            <option value="">All Levels</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filters.country} onChange={e => updateFilter('country', e.target.value)} className="input-custom w-auto">
            <option value="">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Results */}
        {loading ? <LoadingSpinner /> : arts.length === 0 ? <EmptyState message="No martial arts match your filters." /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {arts.map(art => <MartialArtCard key={art._id} art={art} />)}
            </div>

            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={p === page ? 'btn-primary px-4 py-2 text-sm' : 'btn-ghost px-4 py-2 text-sm'}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
