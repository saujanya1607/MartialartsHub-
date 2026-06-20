import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GiKatana } from 'react-icons/gi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch {
      // error toast handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign In — MartialHub</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-modal rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <GiKatana size={36} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Welcome Back</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Continue your martial arts journey</p>
          </div>

          <button onClick={loginWithGoogle} className="glass w-full flex items-center justify-center gap-3 py-3 rounded-xl mb-6 font-medium" style={{ color: 'var(--text-primary)' }}>
            <FcGoogle size={20} /> Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 divider-accent" style={{ margin: 0 }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>OR</span>
            <div className="flex-1 divider-accent" style={{ margin: 0 }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" required placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} className="input-custom" />
            <input type="password" required placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} className="input-custom" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent)' }}>Sign up</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
