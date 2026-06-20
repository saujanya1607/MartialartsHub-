import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { LoadingSpinner } from '../components/ui/Cards';
import { FiX } from 'react-icons/fi';

export default function MapPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/map').then(({ data }) => setData(data)).catch(() => setData([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>World Martial Arts Map — MartialHub</title></Helmet>
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-display tracking-widest mb-2" style={{ color: 'var(--accent)' }}>WORLD MAP</p>
          <h1 className="font-display text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Martial Arts Around the World
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Click a country to discover its fighting traditions</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.map(country => (
              <motion.button
                key={country.country}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelected(country)}
                className="glass rounded-2xl p-5 text-center card-hover"
              >
                <div className="text-3xl mb-2">🌍</div>
                <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{country.country}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{country.arts.length} martial art{country.arts.length !== 1 ? 's' : ''}</p>
              </motion.button>
            ))}
          </div>
        )}

        {/* Country Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="glass-modal rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{selected.country}</h2>
                  <button onClick={() => setSelected(null)} style={{ color: 'var(--text-secondary)' }}><FiX size={20} /></button>
                </div>
                <div className="space-y-3">
                  {selected.arts.map(art => (
                    <Link
                      key={art.slug}
                      to={`/encyclopedia/${art.slug}`}
                      onClick={() => setSelected(null)}
                      className="glass flex items-center justify-between p-4 rounded-xl card-hover"
                    >
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{art.name}</span>
                      {art.category && <span className="tag text-xs">{art.category}</span>}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
