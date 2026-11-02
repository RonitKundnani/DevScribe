import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Copy, Check, Plus, Trash2, X, Loader2 } from 'lucide-react';

const LANGUAGES = ['all', 'javascript', 'python', 'typescript', 'sql', 'html', 'css'];

export default function Snippets() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedLang !== 'all') params.language = selectedLang;
      const res = await API.get('/snippets', { params });
      setSnippets(res.data);
    } catch (err) {
      console.error('Fetch snippets error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, [selectedLang]);

  const handleCopy = (id, snippetCode) => {
    navigator.clipboard.writeText(snippetCode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    setSubmitting(true);
    try {
      const res = await API.post('/snippets', {
        title: title.trim(),
        description: description.trim(),
        language,
        code
      });
      setSnippets([res.data, ...snippets]);
      setOpenModal(false);
      setTitle('');
      setDescription('');
      setCode('');
    } catch (err) {
      console.error('Create snippet error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this code snippet?')) return;
    try {
      await API.delete(`/snippets/${id}`);
      setSnippets(snippets.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Delete snippet error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#242f42]">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Code Snippets</h1>
          <p className="text-xs text-slate-400 mt-0.5">Reusable helper functions, algorithms, and configs.</p>
        </div>

        {user && (
          <button
            onClick={() => setOpenModal(true)}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Snippet
          </button>
        )}
      </div>

      {/* Language filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium capitalize transition ${
              selectedLang === lang
                ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                : 'bg-[#151b26] text-slate-400 hover:text-slate-200 hover:bg-[#1c2433] border border-[#242f42]'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-teal-400 mb-2" />
          <p className="text-xs">Loading snippets...</p>
        </div>
      ) : snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {snippets.map((snippet) => (
            <div key={snippet.id} className="bg-[#151b26] border border-[#242f42] rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c2433] text-teal-300 border border-[#242f42] uppercase">
                      {snippet.language}
                    </span>
                    <h3 className="font-semibold text-slate-100 text-xs">{snippet.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    {user && user.id === snippet.authorId && (
                      <button
                        onClick={() => handleDelete(snippet.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Delete snippet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(snippet.id, snippet.code)}
                      className="p-1 text-slate-400 hover:text-teal-300 transition"
                      title="Copy code"
                    >
                      {copiedId === snippet.id ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {snippet.description && (
                  <p className="text-xs text-slate-400 mb-2.5">{snippet.description}</p>
                )}

                <div className="bg-[#0b0f17] border border-[#242f42] rounded p-3 overflow-x-auto max-h-56">
                  <pre className="font-mono text-xs text-slate-200">
                    <code>{snippet.code}</code>
                  </pre>
                </div>
              </div>

              <div className="pt-2.5 mt-3 border-t border-[#242f42] text-[11px] text-slate-500 flex items-center justify-between font-mono">
                <span>@{snippet.author?.username}</span>
                <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-[#242f42] rounded-lg bg-[#151b26]">
          <p className="text-sm text-slate-300 font-medium mb-1">No snippets found</p>
          <p className="text-xs text-slate-500">No snippets found in this category.</p>
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#151b26] border border-[#242f42] rounded-lg w-full max-w-lg p-5 relative">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-sm font-bold text-slate-100 mb-3">Add Code Snippet</h2>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Async sleep helper"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1c2433] border border-[#242f42] rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#1c2433] border border-[#242f42] rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    {LANGUAGES.filter((l) => l !== 'all').map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description (optional)</label>
                  <input
                    type="text"
                    placeholder="Short description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#1c2433] border border-[#242f42] rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Code</label>
                <textarea
                  rows={7}
                  required
                  placeholder="Paste code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#0b0f17] border border-[#242f42] rounded p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#242f42]">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded text-xs font-medium"
                >
                  {submitting ? 'Saving...' : 'Save Snippet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
