import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { Heart, Trash2, Clock, Calendar, Send, Loader2, ArrowLeft } from 'lucide-react';

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
        comments: [res.data, ...(prev.comments || [])]
      }));
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmittingComment(false);
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
        <p className="text-sm">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">The article you requested could not be located.</p>
        <Link to="/" className="text-xs px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium">
          Back to Feed
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

      {article.coverImage && (
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 border border-slate-800">
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <header className="mb-6 pb-6 border-b border-slate-800">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
          {article.title}
        </h1>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={article.author?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${article.author?.username}`}
              alt={article.author?.name}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
            />
            <div>
              <p className="text-sm font-semibold text-white">{article.author?.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime} min read
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthor && (
              <button
                onClick={handleDeleteArticle}
                className="p-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 text-xs flex items-center gap-1 transition"
                title="Delete article"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-10 shadow-lg">
        <MarkdownRenderer content={article.content} />
      </div>

      {/* Comments */}
      <section className="pt-6 border-t border-slate-800">
        <h3 className="text-xl font-bold text-white mb-4">
          Comments ({article.comments?.length || 0})
        </h3>

        {/* Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
            <textarea
              rows={3}
              placeholder={user ? "Write a comment..." : "Please log in to post a comment"}
              disabled={!user || submittingComment}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
            />
            <div className="flex justify-end pt-2 border-t border-slate-800">
              {user ? (
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Post
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
        <div className="space-y-3">
          {article.comments && article.comments.length > 0 ? (
            article.comments.map((comment) => (
              <div key={comment.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex gap-3">
                <img
                  src={comment.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.user?.username}`}
                  alt={comment.user?.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-200">{comment.user?.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 py-3">No comments yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
