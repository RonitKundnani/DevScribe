import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

// Initial placeholder home page for Step 5
function HomePlaceholder() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
        Welcome to DevScribe
      </h1>
      <p className="text-slate-400 max-w-xl mx-auto mb-8">
        A developer community platform for reading and publishing technical articles and code snippets.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/register"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePlaceholder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
            DevScribe &copy; {new Date().getFullYear()} – Web Technology Project
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
