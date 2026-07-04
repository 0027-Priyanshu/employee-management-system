import express from 'express';
import { authUser, getUserProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define routes and attach controllers and middleware
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

export default router;