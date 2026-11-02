import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Edit3, Eye, Send, Sparkles } from 'lucide-react';

const DEFAULT_CONTENT = `# Title of your article

Write your technical explanation here using **Markdown** formatting.

## Code Example:

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`
`;

export default function CreateArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('react,javascript');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [tab, setTab] = useState('write'); // 'write' or 'preview'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center">
        <h2 className="text-lg font-bold text-white mb-2">Sign In Required</h2>
        <p className="text-xs text-slate-400 mb-6">Please sign in to your account to write and publish articles.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white text-xs font-semibold"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/articles', {
        title: title.trim(),
        summary: summary.trim(),
        tags: tags.trim(),
        coverImage: coverImage.trim(),
        content
      });
      navigate(`/articles/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Draft New Article
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Write with GitHub-flavored Markdown support</p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === 'write' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              tab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            required
            placeholder="Article Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-transparent border-b border-slate-800 focus:border-indigo-500 text-white placeholder-slate-600 pb-2 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Tags (comma separated, e.g. react, nodejs)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="url"
            placeholder="Cover Image URL (optional)"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Brief excerpt / summary (optional)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {tab === 'write' ? (
          <div>
            <textarea
              rows={16}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article body in Markdown..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 min-h-[380px]">
            <MarkdownRenderer content={content} />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" /> {loading ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
