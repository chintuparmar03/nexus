import { Router } from 'express';
import { register, login, googleAuthMock, getProfile, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuthMock);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
