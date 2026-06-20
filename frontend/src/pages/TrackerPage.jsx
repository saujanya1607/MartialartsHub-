import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/Cards';
import { FiTarget, FiPlus, FiCheck, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function TrackerPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState('');

  const load = () => {
    setLoading(true);
    api.get('/tracker').then(({ data }) => setData(data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { if (user) load(); }, [user]);

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    try {
      await api.post('/tracker/goal', { goal: newGoal });
      setNewGoal('');
      load();
      toast.success('Goal added!');
    } catch {}
  };

  const toggleGoal = async (goalId, completed) => {
    try {
      await api.patch(`/tracker/goal/${goalId}`, { completed: !completed });
      load();
    } catch {}
  };

  if (!user) {
    return (
      <div className="pt-32 text-center px-4">
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Sign in to view your learning tracker.</p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading || !data) return <div className="pt-24"><LoadingSpinner /></div>;

  const xpForNextLevel = data.level * 100;
  const xpProgress = Math.min(100, (data.xp % xpForNextLevel) / xpForNextLevel * 100);

  return (
    <>
      <Helmet><title>My Tracker — MartialHub</title></Helmet>
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>My Learning Tracker</h1>
        <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>Welcome back, {user.name.split(' ')[0]} 🥋</p>

        {/* XP Progress */}
        <div className="glass rounded-2xl p-6 mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="font-display font-semibold flex items-center gap-2" style={{ color: 'var(--accent)' }}>
              <FiTrendingUp /> Level {data.level || 1}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{data.xp} XP</span>
          </div>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${xpProgress}%` }} /></div>
        </div>

        {/* Goals */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <FiTarget /> Learning Goals
          </h2>
          <div className="flex gap-2 mb-4">
            <input value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addGoal()}
              placeholder="e.g. Earn my blue belt in BJJ" className="input-custom flex-1" />
            <button onClick={addGoal} className="btn-primary px-4"><FiPlus /></button>
          </div>
          <div className="space-y-2">
            {data.learningGoals?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No goals yet. Add one above!</p>}
            {data.learningGoals?.map(g => (
              <div key={g._id} className="glass flex items-center gap-3 p-4 rounded-xl">
                <button onClick={() => toggleGoal(g._id, g.completed)}
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: `2px solid var(--accent)`, background: g.completed ? 'var(--accent)' : 'transparent' }}>
                  {g.completed && <FiCheck size={12} color="var(--bg-primary)" />}
                </button>
                <span className={g.completed ? 'line-through' : ''} style={{ color: g.completed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                  {g.goal}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Saved Martial Arts */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Saved Martial Arts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.savedMartialArts?.length === 0 && <p className="text-sm col-span-4" style={{ color: 'var(--text-secondary)' }}>Nothing saved yet.</p>}
            {data.savedMartialArts?.map(a => (
              <Link key={a._id} to={`/encyclopedia/${a.slug}`} className="glass p-4 rounded-xl text-center card-hover">
                <div className="text-2xl mb-2">🥋</div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{a.name}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Saved Techniques */}
        <section className="mb-10">
          <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Saved Techniques</h2>
          <div className="flex flex-wrap gap-3">
            {data.savedTechniques?.length === 0 && <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Nothing saved yet.</p>}
            {data.savedTechniques?.map(t => (
              <Link key={t._id} to={`/techniques/${t.slug}`} className="tag px-4 py-2">{t.name}</Link>
            ))}
          </div>
        </section>

        {/* Achievements */}
        {data.achievements?.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold mb-4" style={{ color: 'var(--accent)' }}>Achievements</h2>
            <div className="flex flex-wrap gap-4">
              {data.achievements.map(ach => (
                <div key={ach.id} className="glass p-4 rounded-xl text-center w-32">
                  <div className="text-3xl mb-2">{ach.icon || '🏆'}</div>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{ach.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
