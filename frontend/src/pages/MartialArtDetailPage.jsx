import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/Cards';
import { FiBookmark, FiMapPin, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function MartialArtDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [art, setArt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [aiPath, setAiPath] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/martial-arts/${slug}`)
      .then(({ data }) => setArt(data))
      .catch(() => setArt(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleSave = async () => {
    if (!user) return toast.error('Please sign in to save martial arts.');
    try {
      const { data } = await api.post('/tracker/save-art', { artId: art._id });
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved to your tracker!' : 'Removed from tracker');
    } catch {}
  };

  const generateLearningPath = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/learning-path', { martialArt: art.name });
      setAiPath(data.learningPath);
    } catch {
      toast.error('Could not generate learning path right now.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;
  if (!art) return <div className="pt-32 text-center" style={{ color: 'var(--text-secondary)' }}>Martial art not found.</div>;

  return (
    <>
      <Helmet><title>{art.name} — MartialHub Encyclopedia</title></Helmet>

      {/* Hero */}
      <div className="hero-bg pt-32 pb-16 px-4" style={{ background: art.coverImage ? `var(--hero-overlay), url(${art.coverImage}) center/cover` : 'var(--bg-secondary)' }}>
        <div className="hero-content max-w-4xl mx-auto text-center">
          <p className="text-sm flex items-center justify-center gap-2 mb-3" style={{ color: 'var(--accent)' }}>
            <FiMapPin /> {art.country}
          </p>
          <h1 className="font-display text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>{art.name}</h1>
          <div className="flex gap-2 flex-wrap justify-center mb-6">
            {art.category && <span className="tag">{art.category}</span>}
            {art.difficulty && <span className="tag">{art.difficulty}</span>}
            {art.type && <span className="tag">{art.type}</span>}
            {art.usesWeapons && <span className="tag">uses weapons</span>}
          </div>
          <button onClick={toggleSave} className={saved ? 'btn-primary' : 'btn-ghost'}>
            <FiBookmark style={{ display: 'inline', marginRight: 6 }} />
            {saved ? 'Saved' : 'Save to Tracker'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Description */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Overview</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-primary)' }}>{art.description}</p>
        </section>

        {/* History */}
        <section className="mb-10 glass rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--accent)' }}>History & Origin</h2>
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{art.history}</p>
        </section>

        {/* Philosophy */}
        {art.philosophy && (
          <section className="mb-10 glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--accent)' }}>Philosophy</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{art.philosophy}</p>
          </section>
        )}

        {/* Techniques */}
        {art.techniques?.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Key Techniques</h2>
            <div className="flex flex-wrap gap-3">
              {art.techniques.map(t => (
                <Link key={t._id} to={`/techniques/${t.slug}`} className="tag px-4 py-2 text-sm">{t.name}</Link>
              ))}
            </div>
          </section>
        )}

        {/* Weapons */}
        {art.weapons?.length > 0 && (
          <section className="mb-10">
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Weapons Used</h2>
            <div className="flex flex-wrap gap-3">
              {art.weapons.map(w => <span key={w} className="tag px-4 py-2 text-sm">{w}</span>)}
            </div>
          </section>
        )}

        {/* AI Learning Path */}
        <section className="mb-10 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>AI-Generated Learning Path</h2>
            {!aiPath && (
              <button onClick={generateLearningPath} disabled={aiLoading} className="btn-primary text-sm flex items-center gap-2">
                <FiZap /> {aiLoading ? 'Generating...' : 'Generate'}
              </button>
            )}
          </div>
          {aiPath ? (
            <div className="prose prose-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{aiPath}</div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Let your AI Sensei build a personalized study plan for learning {art.name}.
            </p>
          )}
        </section>

        {/* Related Arts */}
        {art.relatedArts?.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Related Martial Arts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {art.relatedArts.map(r => (
                <Link key={r._id} to={`/encyclopedia/${r.slug}`} className="glass p-4 rounded-xl text-center card-hover">
                  <div className="text-2xl mb-2">🥋</div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
