import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare } from 'lucide-react';

export default function ArticleCard({ article }) {
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tags = article.tags ? article.tags.split(',').filter(Boolean) : [];

  return (
    <article className="bg-[#151b26] border border-[#242f42] rounded-lg p-5 flex flex-col justify-between hover:border-slate-600 transition group">
      <div>
        {/* Meta Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">{article.author?.name}</span>
            <span className="text-slate-600">•</span>
            <span>{formattedDate}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">{article.readTime} min read</span>
        </div>

        {/* Title & Excerpt */}
        <Link to={`/articles/${article.slug}`}>
          <h2 className="text-base font-semibold text-slate-100 group-hover:text-teal-300 transition mb-2 leading-snug">
            {article.title}
          </h2>
        </Link>
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
          {article.summary}
        </p>
      </div>

      {/* Footer info & tags */}
      <div className="pt-3 border-t border-[#242f42] flex items-center justify-between text-xs">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c2433] text-teal-300/80 border border-[#242f42]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-[11px]">
            <Heart className="w-3.5 h-3.5 text-rose-400/80" /> {article._count?.likes ?? 0}
          </span>
          <span className="flex items-center gap-1 text-[11px]">
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> {article._count?.comments ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}
