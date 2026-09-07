import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  deletePost,
  likePost,
} from '../controllers/postController.js';
import { getComments, addComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Post Routes
router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').get(getPostById).delete(protect, deletePost);
router.route('/:id/like').post(protect, likePost);

// Nested Comment Routes
router.route('/:postId/comments').get(getComments).post(protect, addComment);

export default router;
