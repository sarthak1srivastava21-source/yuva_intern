import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getSuggestions,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/suggestions', getSuggestions);
router.put('/profile', protect, updateProfile);
router.get('/:username', getUserProfile);

export default router;
