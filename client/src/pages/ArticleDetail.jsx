import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Heart, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/articles/${slug}`);
        setArticle(res.data);
        setLikesCount(res.data._count?.likes || 0);
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await API.post(`/articles/${article.id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await API.post(`/articles/${article.id}/comments`, { content: commentText.trim() });
      setArticle((prev) => ({
        ...prev,
        comments: [res.data, ...(prev.comments || [])],
        _count: {
          ...prev._count,
          comments: (prev._count?.comments || 0) + 1
        }
      }));
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/articles/comments/${commentId}`);
      setArticle((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
        _count: {
          ...prev._count,
          comments: Math.max(0, (prev._count?.comments || 1) - 1)
        }
      }));
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await API.delete(`/articles/${article.id}`);
      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-slate-500 mb-2" />
        <p className="text-xs">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 text-center border border-slate-800 rounded-lg bg-slate-900">
        <h2 className="text-sm font-semibold text-white mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-400 mb-3">The article you requested could not be located.</p>
        <Link to="/" className="text-xs text-indigo-400 hover:underline">
          Back to articles
        </Link>
      </div>
    );
  }

  const tags = article.tags ? article.tags.split(',').filter(Boolean) : [];
  const isAuthor = user && user.id === article.authorId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Articles
      </Link>

      {/* Header */}
      <header className="mb-6 pb-5 border-b border-slate-800">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          {article.title}
        </h1>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            <span className="text-slate-300 font-medium">{article.author?.name}</span>
            <span className="mx-1.5">•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
            <span className="mx-1.5">•</span>
            <span>{article.readTime} min read</span>
          </div>

          <div className="flex items-center gap-2">
            {isAuthor && (
              <button
                onClick={handleDeleteArticle}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition ${
                liked
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="border border-slate-800 rounded-lg p-6 bg-slate-900/40 mb-8">
        <MarkdownRenderer content={article.content} />
      </article>

      {/* Comments */}
      <section className="pt-4 border-t border-slate-800">
        <h2 className="text-sm font-semibold text-white mb-3">
          Comments ({article.comments?.length || 0})
        </h2>

        {/* Form */}
        <form onSubmit={handleAddComment} className="mb-4">
          <div className="border border-slate-800 rounded p-2.5 bg-slate-900">
            <textarea
              rows={3}
              placeholder={user ? "Add a comment..." : "Log in to post a comment"}
              disabled={!user || submittingComment}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
            />
            <div className="flex justify-end pt-2 border-t border-slate-800/80">
              {user ? (
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded"
                >
                  Post Comment
                </button>
              ) : (
                <Link to="/login" className="text-xs text-indigo-400 hover:underline">
                  Log in to comment
                </Link>
              )}
            </div>
          </div>
        </form>

        {/* List */}
        <div className="space-y-2.5">
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((comment) => {
              const canDelete = user && (user.id === comment.userId || user.id === article.authorId);
              return (
                <div key={comment.id} className="border border-slate-800/80 rounded p-3 bg-slate-900/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-slate-300">{comment.user?.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-slate-500 hover:text-rose-400 transition p-0.5"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{comment.content}</p>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 py-2">No comments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
