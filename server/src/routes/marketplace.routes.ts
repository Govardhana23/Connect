import { Router } from 'express';
import { getCategories, createCategory, getServices, createService, getServiceById } from '../controllers/service.controller';
import { updateProfile, getProviders, getProviderById } from '../controllers/provider.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Categories
router.get('/categories', getCategories);
router.post('/categories', authenticateToken, createCategory); // Admin only ideal

// Services
router.get('/services', getServices);
router.get('/services/:id', getServiceById);
router.post('/services', authenticateToken, createService);

// Providers
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);
router.put('/providers/profile', authenticateToken, updateProfile);

export default router;
