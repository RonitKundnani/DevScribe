import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, PenSquare, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-400 font-bold text-lg hover:text-indigo-300">
          <Code2 className="w-6 h-6" />
          <span className="text-white tracking-tight">DevScribe</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-slate-300 hover:text-white transition">
            Articles
          </Link>
          <Link to="/snippets" className="text-slate-300 hover:text-white transition">
            Snippets
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/create"
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <PenSquare className="w-3.5 h-3.5" />
                Write
              </Link>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <span className="text-xs text-slate-400">@{user.username}</span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-1 text-slate-300 hover:text-white transition text-xs"
              >
                <LogIn className="w-3.5 h-3.5" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
              >
                <UserPlus className="w-3.5 h-3.5" /> Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
