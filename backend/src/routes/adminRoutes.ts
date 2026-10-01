import { Router } from 'express';
import { getAdminStats, createSkill, updateSkill, deleteSkill } from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', getAdminStats);
router.post('/skills', createSkill);
router.put('/skills/:skillId', updateSkill);
router.delete('/skills/:skillId', deleteSkill);

export default router;
