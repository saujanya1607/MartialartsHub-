import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { GiKatana } from 'react-icons/gi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to MartialHub!');
      navigate('/');
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Create Account — MartialHub</title></Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-modal rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <GiKatana size={36} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Begin Your Journey</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Create your free MartialHub account</p>
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
            <input required placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} className="input-custom" />
            <input type="email" required placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} className="input-custom" />
            <input type="password" required minLength={6} placeholder="Password (6+ characters)" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} className="input-custom" />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
