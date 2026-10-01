import { Router } from 'express';
import { getAllSkills, getGraphTopology, getSkillDetails, updateUserSkillProficiency } from '../controllers/skillController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllSkills);
router.get('/topology', getGraphTopology);
router.get('/:skillId', getSkillDetails);
router.post('/user-skill', authenticateToken, updateUserSkillProficiency);

export default router;
