import { Router, Response } from 'express';
import { AuthRequest, authenticateToken } from '../middleware/authMiddleware';
import { AIService } from '../services/AIService';
import { User } from '../models/User';

const router = Router();

router.post('/chat', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    let userProfile = {
      name: 'Developer',
      targetCareer: 'Full Stack Engineer',
      readinessPct: 65,
      missingSkills: ['System Design', 'Docker', 'PostgreSQL', 'GraphQL']
    };

    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        userProfile.name = user.name;
        userProfile.targetCareer = user.targetCareerId || 'Full Stack Engineer';
      }
    }

    const reply = await AIService.generateAdvisorReply(message, userProfile);
    res.json({ success: true, reply });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
