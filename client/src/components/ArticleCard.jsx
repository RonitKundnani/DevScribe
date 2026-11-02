import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Clock, ArrowRight } from 'lucide-react';

export default function ArticleCard({ article }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tags = article.tags ? article.tags.split(',').filter(Boolean) : [];

  return (
    <article className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition flex flex-col justify-between shadow-lg">
      <div>
        {article.coverImage && (
          <div className="aspect-video w-full overflow-hidden bg-slate-800">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Author info */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={article.author?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${article.author?.username}`}
              alt={article.author?.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
            />
            <div>
              <p className="text-sm font-medium text-slate-200">{article.author?.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime} min read
                </span>
              </div>
            </div>
          </div>

          {/* Title & Summary */}
          <Link to={`/articles/${article.slug}`}>
            <h3 className="text-xl font-bold text-white hover:text-indigo-400 transition mb-2 line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
            {article.summary}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Link
                key={tag}
                to={`/?tag=${tag}`}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-indigo-300 hover:bg-slate-700 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-6 py-3.5 border-t border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> {article._count?.likes ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> {article._count?.comments ?? 0}
          </span>
        </div>
        <Link
          to={`/articles/${article.slug}`}
          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          Read <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </article>
  );
}
