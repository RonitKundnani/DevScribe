import express from 'express';
import {
  getArticles,
  getArticleBySlug,
  createArticle,
  deleteArticle,
  toggleLike,
  addComment
} from '../controllers/articleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

// Protected routes (requires login)
router.post('/', protect, createArticle);
router.delete('/:id', protect, deleteArticle);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

export default router;
