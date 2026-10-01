import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Career, ICareer } from '../models/Career';
import { Skill, ISkill } from '../models/Skill';
import { User } from '../models/User';
import { GraphEngine, SkillNodeData, UserSkillState } from '../services/GraphEngine';
import { SEED_CAREERS, SEED_SKILLS } from '../seed/seedData';
import { isMongoDbConnected, memoryUsers } from './authController';

async function getCareersList(): Promise<ICareer[]> {
  if (isMongoDbConnected()) {
    try {
      const dbCareers = await Career.find().lean();
      if (dbCareers.length > 0) return dbCareers as any;
    } catch (e) {}
  }
  return SEED_CAREERS as any;
}

async function getSkillsMap(): Promise<Map<string, SkillNodeData>> {
  let skillsList: any[] = SEED_SKILLS;
  if (isMongoDbConnected()) {
    try {
      const dbSkills = await Skill.find().lean();
      if (dbSkills.length > 0) skillsList = dbSkills;
    } catch (e) {}
  }

  const map = new Map<string, SkillNodeData>();
  skillsList.forEach(s => {
    map.set(s.skillId, {
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
  return map;
}

export const getAllCareers = async (req: AuthRequest, res: Response) => {
  try {
    const careers = await getCareersList();
    res.json({ success: true, count: careers.length, careers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCareerGapAnalysis = async (req: AuthRequest, res: Response) => {
  try {
    const { careerId } = req.params;
    const careers = await getCareersList();
    const career = careers.find(c => c.careerId === careerId);

    if (!career) {
      return res.status(404).json({ success: false, message: 'Career path not found' });
    }

    const skillsMap = await getSkillsMap();
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

    const readiness = GraphEngine.calculateCareerReadiness(
      career.requiredSkills,
      userSkillMap,
      skillsMap,
      weeklyHours
    );

    const enrichedBreakdown = readiness.skillBreakdown.map(item => {
      const skillDetail = skillsMap.get(item.skillId);
      return {
        ...item,
        skillName: skillDetail?.name || item.skillId,
        category: skillDetail?.category || 'General',
        difficulty: skillDetail?.difficulty || 'Beginner',
        estimatedHours: skillDetail?.estimatedHours || 20,
        prerequisites: skillDetail?.prerequisites || []
      };
    });

    res.json({
      success: true,
      career: {
        careerId: career.careerId,
        title: career.title,
        description: career.description,
        averageSalary: career.averageSalary,
        industryDemand: career.industryDemand,
        futureGrowth: career.futureGrowth,
        iconName: career.iconName,
        keyResponsibilities: career.keyResponsibilities
      },
      readiness: {
        ...readiness,
        skillBreakdown: enrichedBreakdown
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopCareerMatches = async (req: AuthRequest, res: Response) => {
  try {
    const careers = await getCareersList();
    const skillsMap = await getSkillsMap();
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

    const matches = careers.map(c => {
      const readiness = GraphEngine.calculateCareerReadiness(c.requiredSkills, userSkillMap, skillsMap, weeklyHours);
      return {
        careerId: c.careerId,
        title: c.title,
        description: c.description,
        averageSalary: c.averageSalary,
        industryDemand: c.industryDemand,
        iconName: c.iconName,
        readinessPercentage: readiness.readinessPercentage,
        missingSkillCount: readiness.missingSkillIds.length,
        totalEstimatedHoursLeft: readiness.totalEstimatedHoursLeft
      };
    }).sort((a, b) => b.readinessPercentage - a.readinessPercentage);

    res.json({ success: true, matches });
  } catch (error: any) {
    console.error('[Career Matches Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
