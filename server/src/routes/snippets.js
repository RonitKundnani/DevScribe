import express from 'express';
import {
  getSnippets,
  createSnippet,
  deleteSnippet
} from '../controllers/snippetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getSnippets);

// Protected routes (requires login)
router.post('/', protect, createSnippet);
router.delete('/:id', protect, deleteSnippet);

export default router;
