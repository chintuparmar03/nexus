import { Router } from 'express';
import { getRoadmap } from '../controllers/roadmapController';

const router = Router();

router.get('/', getRoadmap);

export default router;
