import { Router } from 'express';
import { register, login, googleAuth, phoneAuth, getMe } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/phone', phoneAuth);
router.get('/me', authenticateToken, getMe);

export default router;
