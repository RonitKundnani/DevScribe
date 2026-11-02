import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(identifier, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email) => {
    setIdentifier(email);
    setPassword('password123');
  };

  return (
    <div className="max-w-sm mx-auto my-16 px-4">
      <div className="bg-[#151b26] border border-[#242f42] rounded-lg p-6">
        <h1 className="text-base font-bold text-slate-100 mb-1">Sign in</h1>
        <p className="text-xs text-slate-400 mb-5">Access your DevScribe account</p>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email or Username</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full bg-[#1c2433] border border-[#242f42] rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#1c2433] border border-[#242f42] rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded text-xs font-medium transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#242f42]">
          <p className="text-[11px] text-slate-500 mb-2 font-mono">Demo accounts:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('alex@example.com')}
              className="flex-1 py-1 bg-[#1c2433] hover:bg-slate-700 border border-[#242f42] text-[11px] rounded text-slate-300 transition"
            >
              Alex
            </button>
            <button
              type="button"
              onClick={() => fillDemo('sarah@example.com')}
              className="flex-1 py-1 bg-[#1c2433] hover:bg-slate-700 border border-[#242f42] text-[11px] rounded text-slate-300 transition"
            >
              Sarah
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          New here?{' '}
          <Link to="/register" className="text-teal-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
