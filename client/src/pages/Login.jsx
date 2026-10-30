import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

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

  // Quick fill helper for testing during evaluations
  const fillDemo = (email) => {
    setIdentifier(email);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <LogIn className="w-5 h-5 text-indigo-400" /> Sign In
        </h2>
        <p className="text-xs text-slate-400 mb-6">Enter your email or username to access your account</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email or Username</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="alex@example.com or alexdev"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo login buttons for presentation / viva */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-[11px] text-slate-500 mb-2 font-medium">Demo accounts for testing:</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemo('alex@example.com')}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded text-slate-300 transition"
            >
              Demo: Alex
            </button>
            <button
              type="button"
              onClick={() => fillDemo('sarah@example.com')}
              className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs rounded text-slate-300 transition"
            >
              Demo: Sarah
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
