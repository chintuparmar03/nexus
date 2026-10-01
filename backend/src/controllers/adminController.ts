import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Skill } from '../models/Skill';
import { Career } from '../models/Career';
import { User } from '../models/User';
import { SEED_CAREERS, SEED_SKILLS } from '../seed/seedData';
import { isMongoDbConnected, memoryUsers } from './authController';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    let totalUsers = memoryUsers.size || 1;
    let totalSkills = SEED_SKILLS.length;
    let totalCareers = SEED_CAREERS.length;
    let recentUsers: any[] = Array.from(memoryUsers.values()).slice(0, 10);

    if (isMongoDbConnected()) {
      try {
        totalUsers = await User.countDocuments();
        totalSkills = await Skill.countDocuments();
        totalCareers = await Career.countDocuments();
        recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('name email college degree targetCareerId level xp createdAt').lean();
      } catch (e) {}
    }

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSkills,
        totalCareers,
        activeLearnersThisWeek: Math.max(1, Math.round(totalUsers * 0.85))
      },
      recentUsers
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createSkill = async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoDbConnected()) {
      const skill = await Skill.create(req.body);
      return res.status(201).json({ success: true, skill });
    }
    SEED_SKILLS.push(req.body);
    res.status(201).json({ success: true, skill: req.body });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoDbConnected()) {
      const skill = await Skill.findOneAndUpdate({ skillId: req.params.skillId }, req.body, { new: true });
      if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.json({ success: true, skill });
    }
    const idx = SEED_SKILLS.findIndex(s => s.skillId === req.params.skillId);
    if (idx >= 0) {
      SEED_SKILLS[idx] = { ...SEED_SKILLS[idx], ...req.body };
      return res.json({ success: true, skill: SEED_SKILLS[idx] });
    }
    res.status(404).json({ success: false, message: 'Skill not found' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoDbConnected()) {
      const skill = await Skill.findOneAndDelete({ skillId: req.params.skillId });
      if (!skill) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.json({ success: true, message: 'Skill deleted successfully' });
    }
    const idx = SEED_SKILLS.findIndex(s => s.skillId === req.params.skillId);
    if (idx >= 0) {
      SEED_SKILLS.splice(idx, 1);
      return res.json({ success: true, message: 'Skill deleted successfully' });
    }
    res.status(404).json({ success: false, message: 'Skill not found' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
