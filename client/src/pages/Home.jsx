import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import ArticleCard from '../components/ArticleCard';
import { Loader2, Search, PenLine } from 'lucide-react';

const TAGS = ['all', 'react', 'javascript', 'nodejs', 'express', 'frontend', 'backend'];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeTag = searchParams.get('tag') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      nextParams.set('search', localSearch.trim());
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner / Utility Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#242f42]">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Articles</h1>
          <p className="text-xs text-slate-400 mt-0.5">Software design notes, tutorials, and development logs.</p>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-[#151b26] border border-[#242f42] text-xs text-slate-200 placeholder-slate-500 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-teal-500 transition w-44 sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </form>

          <Link
            to="/create"
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <PenLine className="w-3.5 h-3.5" /> New Post
          </Link>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6">
        {TAGS.map((tag) => {
          const isActive = (tag === 'all' && (!activeTag || activeTag === 'all')) || activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium capitalize transition ${
                isActive
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                  : 'bg-[#151b26] text-slate-400 hover:text-slate-200 hover:bg-[#1c2433] border border-[#242f42]'
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>

      {/* Article Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-teal-400 mb-2" />
          <p className="text-xs">Loading articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-[#242f42] rounded-lg bg-[#151b26]">
          <p className="text-sm text-slate-300 font-medium mb-1">No articles found</p>
          <p className="text-xs text-slate-500 mb-3">No posts found matching the current search or tag filter.</p>
          <button
            onClick={() => {
              setLocalSearch('');
              setSearchParams({});
            }}
            className="px-3 py-1.5 bg-[#1c2433] hover:bg-slate-700 text-slate-300 text-xs rounded border border-[#242f42] transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
