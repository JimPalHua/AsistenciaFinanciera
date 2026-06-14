import express from 'express';
import { registerUser, authUser, getUserProfile, updateUserProfile, getAllUsers, getAllMessages } from '../controllers/authController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/users', protect, admin, getAllUsers);
router.get('/messages', protect, admin, getAllMessages);

export default router;
