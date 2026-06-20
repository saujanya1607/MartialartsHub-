import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/Cards';
import { FiBookmark, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TechniqueDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [technique, setTechnique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [aiExplain, setAiExplain] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/techniques/${slug}`).then(({ data }) => setTechnique(data)).catch(() => setTechnique(null)).finally(() => setLoading(false));
  }, [slug]);

  const toggleSave = async () => {
    if (!user) return toast.error('Please sign in to save techniques.');
    try {
      const { data } = await api.post('/tracker/save-technique', { techniqueId: technique._id });
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved!' : 'Removed');
    } catch {}
  };

  const explainWithAI = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/explain-technique', { techniqueName: technique.name });
      setAiExplain(data.explanation);
    } catch { toast.error('AI explanation unavailable right now.'); }
    finally { setAiLoading(false); }
  };

  if (loading) return <div className="pt-24"><LoadingSpinner /></div>;
  if (!technique) return <div className="pt-32 text-center" style={{ color: 'var(--text-secondary)' }}>Technique not found.</div>;

  return (
    <>
      <Helmet><title>{technique.name} — MartialHub</title></Helmet>
      <div className="pt-28 pb-16 px-4 max-w-3xl mx-auto">
        <div className="flex gap-2 mb-4">
          <span className="tag">{technique.category}</span>
          {technique.difficulty && <span className="tag">{technique.difficulty}</span>}
        </div>
        <h1 className="font-display text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>{technique.name}</h1>

        <button onClick={toggleSave} className={`${saved ? 'btn-primary' : 'btn-ghost'} mb-8`}>
          <FiBookmark style={{ display: 'inline', marginRight: 6 }} />{saved ? 'Saved' : 'Save to Tracker'}
        </button>

        <section className="mb-8">
          <p className="leading-relaxed" style={{ color: 'var(--text-primary)' }}>{technique.description}</p>
        </section>

        {technique.steps?.length > 0 && (
          <section className="mb-8 glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Step by Step</h2>
            <ol className="space-y-3">
              {technique.steps.sort((a,b) => a.order - b.order).map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'rgba(var(--accent-rgb),0.2)', color: 'var(--accent)' }}>{s.order}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.instruction}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {technique.commonMistakes?.length > 0 && (
          <section className="mb-8 glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Common Mistakes</h2>
            <ul className="list-disc pl-5 space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {technique.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </section>
        )}

        {technique.learningTips?.length > 0 && (
          <section className="mb-8 glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Learning Tips</h2>
            <ul className="list-disc pl-5 space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {technique.learningTips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </section>
        )}

        {technique.martialArts?.length > 0 && (
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Used In These Martial Arts</h2>
            <div className="flex flex-wrap gap-3">
              {technique.martialArts.map(a => (
                <Link key={a._id} to={`/encyclopedia/${a.slug}`} className="tag px-4 py-2">{a.name}</Link>
              ))}
            </div>
          </section>
        )}

        <section className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold" style={{ color: 'var(--accent)' }}>Ask AI Sensei</h2>
            {!aiExplain && (
              <button onClick={explainWithAI} disabled={aiLoading} className="btn-primary text-sm flex items-center gap-2">
                <FiZap /> {aiLoading ? 'Thinking...' : 'Explain Further'}
              </button>
            )}
          </div>
          {aiExplain && <div className="whitespace-pre-wrap text-sm" style={{ color: 'var(--text-secondary)' }}>{aiExplain}</div>}
        </section>
      </div>
    </>
  );
}
