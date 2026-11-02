import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, PenLine, Terminal, BookOpen } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="border-b border-[#242f42] bg-[#151b26]/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono font-bold text-sm flex items-center justify-center group-hover:border-teal-400 transition">
              d/s
            </span>
            <span className="text-slate-100 font-semibold text-sm tracking-tight">
              DevScribe
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                isActive('/')
                  ? 'bg-[#1c2433] text-teal-300 font-semibold border border-[#242f42]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c2433]/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Articles
            </Link>
            <Link
              to="/snippets"
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition ${
                isActive('/snippets')
                  ? 'bg-[#1c2433] text-teal-300 font-semibold border border-[#242f42]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#1c2433]/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" /> Snippets
            </Link>
          </nav>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3 text-xs">
          {user ? (
            <>
              <Link
                to="/create"
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition"
              >
                <PenLine className="w-3.5 h-3.5" /> Write
              </Link>

              <div className="flex items-center gap-2 pl-3 border-l border-[#242f42]">
                <span className="text-slate-400 font-mono text-[11px]">@{user.username}</span>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 text-slate-400 hover:text-rose-400 transition rounded hover:bg-[#1c2433]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-2.5 py-1.5 rounded hover:bg-[#1c2433] transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium px-3 py-1.5 rounded-md transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
