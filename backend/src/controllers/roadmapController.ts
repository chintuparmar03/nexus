import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Career } from '../models/Career';
import { Skill } from '../models/Skill';
import { User } from '../models/User';
import { GraphEngine, SkillNodeData, UserSkillState } from '../services/GraphEngine';
import { SEED_CAREERS, SEED_SKILLS } from '../seed/seedData';
import { isMongoDbConnected, memoryUsers } from './authController';

export const getRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const { careerId } = req.query;
    let targetCareerId = typeof careerId === 'string' ? careerId : 'fullstack-engineer';

    const userSkillMap = new Map<string, UserSkillState>();
    let weeklyHours = 10;

    if (req.user) {
      let currentUser: any = null;
      if (isMongoDbConnected()) {
        currentUser = await User.findById(req.user.id).lean();
      } else {
        for (const u of memoryUsers.values()) {
          if (u._id === req.user.id) {
            currentUser = u;
            break;
          }
        }
      }

      if (currentUser) {
        if (!careerId && currentUser.targetCareerId) {
          targetCareerId = currentUser.targetCareerId;
        }
        weeklyHours = currentUser.preferredLearningHours || 10;
        (currentUser.userSkills || []).forEach((us: any) => {
          userSkillMap.set(us.skillId, {
            skillId: us.skillId,
            proficiency: us.proficiency,
            status: us.status
          });
        });
      }
    }

    let careers: any[] = SEED_CAREERS;
    if (isMongoDbConnected()) {
      try {
        const dbCareers = await Career.find().lean();
        if (dbCareers.length > 0) careers = dbCareers;
      } catch (e) {}
    }
    const career = careers.find(c => c.careerId === targetCareerId) || careers[0];

    let dbSkills: any[] = SEED_SKILLS;
    if (isMongoDbConnected()) {
      try {
        const s = await Skill.find().lean();
        if (s.length > 0) dbSkills = s;
      } catch (e) {}
    }

    const skillsMap = new Map<string, SkillNodeData>();
    dbSkills.forEach(s => {
      skillsMap.set(s.skillId, {
        skillId: s.skillId,
        name: s.name,
        category: s.category,
        difficulty: s.difficulty,
        estimatedHours: s.estimatedHours,
        industryDemand: s.industryDemand,
        prerequisites: s.prerequisites || [],
        relatedSkills: s.relatedSkills || []
      });
    });

    const rawStages = GraphEngine.generateInteractiveRoadmap(
      career.requiredSkills,
      userSkillMap,
      skillsMap
    );

    let totalRoadmapHours = 0;
    let completedRoadmapHours = 0;

    const enrichedStages = rawStages.map(stage => {
      const enrichedSkills = stage.skills.map(item => {
        const fullSkill = dbSkills.find(s => s.skillId === item.skillId);
        const userState = userSkillMap.get(item.skillId);

        const isCompleted = userState?.status === 'Completed' || (userState?.proficiency || 0) >= 4;
        const isInProgress = userState?.status === 'Learning';

        totalRoadmapHours += item.estimatedHours;
        if (isCompleted) {
          completedRoadmapHours += item.estimatedHours;
        }

        return {
          ...item,
          name: fullSkill?.name || item.skillId,
          description: fullSkill?.description || '',
          category: fullSkill?.category || 'General',
          resources: fullSkill?.resources || [],
          isCompleted,
          isInProgress,
          userProficiency: userState?.proficiency || 0
        };
      });

      return {
        ...stage,
        skills: enrichedSkills,
        completedCount: enrichedSkills.filter(s => s.isCompleted).length,
        totalCount: enrichedSkills.length
      };
    });

    const progressPercentage = Math.round((completedRoadmapHours / Math.max(1, totalRoadmapHours)) * 100);
    const remainingHours = totalRoadmapHours - completedRoadmapHours;
    const estimatedWeeksLeft = Math.ceil(remainingHours / Math.max(1, weeklyHours));

    res.json({
      success: true,
      career: {
        careerId: career.careerId,
        title: career.title,
        description: career.description
      },
      roadmap: {
        stages: enrichedStages,
        totalRoadmapHours,
        completedRoadmapHours,
        progressPercentage,
        remainingHours,
        estimatedWeeksLeft,
        weeklyHours
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
