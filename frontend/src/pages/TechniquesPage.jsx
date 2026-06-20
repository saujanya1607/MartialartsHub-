import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSearch } from 'react-icons/fi';
import api from '../utils/api';
import { TechniqueCard, LoadingSpinner, EmptyState } from '../components/ui/Cards';

const CATEGORIES = ['punches','kicks','elbows','knees','throws','takedowns','joint-locks','chokes','ground-fighting','weapon-techniques','defensive'];

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', difficulty: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 24 };
      Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
      const { data } = await api.get('/techniques', { params });
      setTechniques(data.data);
      setPages(data.pages);
    } catch { setTechniques([]); }
    finally { setLoading(false); }
  }, [filters, page]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const updateFilter = (k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); };

  return (
    <>
      <Helmet><title>Technique Database — MartialHub</title></Helmet>
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>TECHNIQUE DATABASE</p>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>10,000+ Techniques</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Punches, kicks, throws, locks — mastered step by step</p>
        </div>

        <div className="max-w-2xl mx-auto mb-6 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input value={filters.search} onChange={e => updateFilter('search', e.target.value)}
            placeholder="Search techniques..." className="input-custom pl-12" />
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <select value={filters.category} onChange={e => updateFilter('category', e.target.value)} className="input-custom w-auto">
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filters.difficulty} onChange={e => updateFilter('difficulty', e.target.value)} className="input-custom w-auto">
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {loading ? <LoadingSpinner /> : techniques.length === 0 ? <EmptyState message="No techniques match your filters." /> : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {techniques.map(t => <TechniqueCard key={t._id} technique={t} />)}
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
