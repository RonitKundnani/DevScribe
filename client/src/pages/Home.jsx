import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Sparkles, Terminal, Tag, ArrowRight, Loader2 } from 'lucide-react';

const TAGS = ['all', 'react', 'javascript', 'nodejs', 'express', 'frontend', 'backend'];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTag = searchParams.get('tag') || 'all';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeTag && activeTag !== 'all') params.tag = activeTag;
        if (searchQuery) params.search = searchQuery;

        const res = await API.get('/articles', { params });
        setArticles(res.data);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [activeTag, searchQuery]);

  const handleTagClick = (tag) => {
    const nextParams = new URLSearchParams(searchParams);
    if (tag === 'all') {
      nextParams.delete('tag');
    } else {
      nextParams.set('tag', tag);
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <section className="text-center py-10 mb-8 border-b border-slate-800">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Technical Developer Platform
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Read, Write & Share Modern Engineering
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mb-6">
          A place to publish technical writeups, explore tutorials, and share reusable code snippets.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/create"
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            Start Writing <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/snippets"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4 text-cyan-400" /> Explore Snippets
          </Link>
        </div>
      </section>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        <Tag className="w-4 h-4 text-slate-500 shrink-0" />
        {TAGS.map((tag) => {
          const isActive = (tag === 'all' && (!activeTag || activeTag === 'all')) || activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Article Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
          <p className="text-sm">Loading articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-300 font-semibold mb-1">No articles found</p>
          <p className="text-xs text-slate-500 mb-4">Try clearing your filters or write the first article!</p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
