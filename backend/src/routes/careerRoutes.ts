import { Router } from 'express';
import { getAllCareers, getCareerGapAnalysis, getTopCareerMatches } from '../controllers/careerController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllCareers);
router.get('/matches', getTopCareerMatches);
router.get('/:careerId/gap-analysis', getCareerGapAnalysis);

export default router;
