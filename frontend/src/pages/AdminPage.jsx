import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { LoadingSpinner } from '../components/ui/Cards';
import { FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY_ART = {
  name: '', slug: '', origin: '', country: '', countryCode: '', category: 'striking', type: 'traditional',
  difficulty: 'beginner', usesWeapons: false, history: '', philosophy: '', description: '', tags: '',
};

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('stats');
  const [artForm, setArtForm] = useState(EMPTY_ART);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  useEffect(() => {
    if (isAdmin) api.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => {});
  }, [isAdmin]);

  if (!user) return <div className="pt-32 text-center" style={{ color: 'var(--text-secondary)' }}>Please sign in.</div>;
  if (!isAdmin) return <div className="pt-32 text-center" style={{ color: 'var(--text-secondary)' }}>Admin access required.</div>;

  const generateAISummary = async () => {
    if (!artForm.name) return toast.error('Enter a name first');
    setAiGenerating(true);
    try {
      const { data } = await api.post('/admin/generate-summary', { name: artForm.name, type: 'martial-art' });
      setArtForm(prev => ({ ...prev, description: data.summary }));
      toast.success('AI description generated!');
    } catch { toast.error('AI generation failed'); }
    finally { setAiGenerating(false); }
  };

  const submitArt = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...artForm,
        slug: artForm.slug || artForm.name.toLowerCase().replace(/\s+/g, '-'),
        tags: artForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await api.post('/martial-arts', payload);
      toast.success('Martial art added!');
      setArtForm(EMPTY_ART);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Dashboard — MartialHub</title></Helmet>
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>

        <div className="flex gap-2 mb-8">
          {['stats', 'add-art'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? 'btn-primary text-sm' : 'btn-ghost text-sm'}>
              {t === 'stats' ? 'Overview' : 'Add Martial Art'}
            </button>
          ))}
        </div>

        {tab === 'stats' && (
          stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Martial Arts', value: stats.arts },
                  { label: 'Techniques', value: stats.techniques },
                  { label: 'Books', value: stats.books },
                  { label: 'Users', value: stats.users },
                ].map(s => (
                  <div key={s.label} className="glass rounded-2xl p-6 text-center">
                    <div className="font-display text-3xl font-bold" style={{ color: 'var(--accent)' }}>{s.value}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Recent Users</h2>
              <div className="glass rounded-2xl divide-y" style={{ borderColor: 'var(--card-border)' }}>
                {stats.recentUsers.map(u => (
                  <div key={u._id} className="p-4 flex justify-between items-center" style={{ borderColor: 'var(--card-border)' }}>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
                    </div>
                    <span className="tag text-xs">{u.role}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <LoadingSpinner />
        )}

        {tab === 'add-art' && (
          <form onSubmit={submitArt} className="glass rounded-2xl p-6 space-y-4 max-w-2xl">
            <input required placeholder="Name (e.g. Muay Thai)" value={artForm.name}
              onChange={e => setArtForm({ ...artForm, name: e.target.value })} className="input-custom" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="Origin (e.g. Ancient Siam)" value={artForm.origin}
                onChange={e => setArtForm({ ...artForm, origin: e.target.value })} className="input-custom" />
              <input required placeholder="Country (e.g. Thailand)" value={artForm.country}
                onChange={e => setArtForm({ ...artForm, country: e.target.value })} className="input-custom" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <select value={artForm.category} onChange={e => setArtForm({ ...artForm, category: e.target.value })} className="input-custom">
                {['striking','grappling','weapons','mixed','internal','self-defense','sport'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={artForm.type} onChange={e => setArtForm({ ...artForm, type: e.target.value })} className="input-custom">
                {['traditional','modern','hybrid'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={artForm.difficulty} onChange={e => setArtForm({ ...artForm, difficulty: e.target.value })} className="input-custom">
                {['beginner','intermediate','advanced','all-levels'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={artForm.usesWeapons} onChange={e => setArtForm({ ...artForm, usesWeapons: e.target.checked })} />
              Uses Weapons
            </label>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Description</label>
                <button type="button" onClick={generateAISummary} disabled={aiGenerating} className="btn-ghost text-xs flex items-center gap-1">
                  <FiZap size={12} /> {aiGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea required rows={3} value={artForm.description}
                onChange={e => setArtForm({ ...artForm, description: e.target.value })} className="input-custom" />
            </div>

            <textarea required rows={3} placeholder="History" value={artForm.history}
              onChange={e => setArtForm({ ...artForm, history: e.target.value })} className="input-custom" />
            <textarea rows={2} placeholder="Philosophy (optional)" value={artForm.philosophy}
              onChange={e => setArtForm({ ...artForm, philosophy: e.target.value })} className="input-custom" />
            <input placeholder="Tags (comma separated)" value={artForm.tags}
              onChange={e => setArtForm({ ...artForm, tags: e.target.value })} className="input-custom" />

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving...' : 'Add Martial Art'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
