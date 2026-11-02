import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';

const DEFAULT_CONTENT = `# Title

Write your article here using Markdown.

## Overview
Brief introduction to the problem and solution.

## Implementation Example
\`\`\`javascript
function calculateSum(a, b) {
  return a + b;
}
\`\`\`
`;

export default function CreateArticle() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('react,javascript');
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [tab, setTab] = useState('write');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-[#151b26] border border-[#242f42] rounded-lg text-center">
        <h2 className="text-sm font-semibold text-slate-100 mb-1">Sign-in Required</h2>
        <p className="text-xs text-slate-400 mb-4">Please log in to write and publish an article.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 rounded text-white text-xs font-medium transition"
        >
          Sign In
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between pb-4 border-b border-[#242f42] mb-6">
        <div>
          <h1 className="text-lg font-bold text-slate-100">Write Article</h1>
          <p className="text-xs text-slate-400 mt-0.5">Markdown format with syntax highlighting.</p>
        </div>

        <div className="flex bg-[#151b26] border border-[#242f42] p-0.5 rounded text-xs">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-3 py-1 rounded transition ${
              tab === 'write' ? 'bg-[#1c2433] text-teal-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-3 py-1 rounded transition ${
              tab === 'preview' ? 'bg-[#1c2433] text-teal-300 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Understanding React useEffect Lifecycle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#151b26] border border-[#242f42] rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. react, hooks, javascript"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-[#151b26] border border-[#242f42] rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Short Excerpt (optional)</label>
            <input
              type="text"
              placeholder="Brief summary for card display"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full bg-[#151b26] border border-[#242f42] rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        {tab === 'write' ? (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Content (Markdown)</label>
            <textarea
              rows={16}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#151b26] border border-[#242f42] rounded p-3.5 font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-teal-500"
            />
          </div>
        ) : (
          <div className="bg-[#151b26] border border-[#242f42] rounded p-6 min-h-[360px]">
            <MarkdownRenderer content={content} />
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-[#242f42]">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded text-xs font-medium transition"
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
