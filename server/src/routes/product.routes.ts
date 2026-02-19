import { Router } from 'express';
import { getProducts, createProduct, getProductById } from '../controllers/product.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/products', getProducts);
router.post('/products', authenticateToken, createProduct);
router.get('/products/:id', getProductById);

export default router;
