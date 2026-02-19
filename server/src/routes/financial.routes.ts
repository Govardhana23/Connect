import { Router } from 'express';
import { getFinancialPlan, updateFinancialPlan } from '../controllers/financial.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/financial-plan', authenticateToken, getFinancialPlan);
router.post('/financial-plan', authenticateToken, updateFinancialPlan);

export default router;
