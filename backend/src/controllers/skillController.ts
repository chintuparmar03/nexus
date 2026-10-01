import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Skill, ISkill } from '../models/Skill';
import { User } from '../models/User';
import { Career } from '../models/Career';
import { GraphEngine, SkillNodeData, UserSkillState } from '../services/GraphEngine';
import { AIService } from '../services/AIService';
import { SEED_SKILLS, SEED_CAREERS } from '../seed/seedData';
import { isMongoDbConnected, memoryUsers } from './authController';

async function getSkillsList(): Promise<ISkill[]> {
  if (isMongoDbConnected()) {
    try {
      const dbSkills = await Skill.find().lean();
      if (dbSkills.length > 0) return dbSkills as any;
    } catch (e) {}
  }
  return SEED_SKILLS as any;
}

export const getAllSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, search } = req.query;
    let skills = await getSkillsList();

    if (category && category !== 'All') {
      skills = skills.filter(s => s.category === category);
    }
    if (difficulty && difficulty !== 'All') {
      skills = skills.filter(s => s.difficulty === difficulty);
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      skills = skills.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    res.json({ success: true, count: skills.length, skills });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGraphTopology = async (req: AuthRequest, res: Response) => {
  try {
    const allSkills = await getSkillsList();
    let userSkillMap = new Map<string, UserSkillState>();
    let targetCareerId = 'fullstack-engineer';

    if (req.user) {
      let currentUser: any = null;
      if (isMongoDbConnected()) {
        currentUser = await User.findById(req.user.id).select('userSkills targetCareerId').lean();
      } else {
        for (const u of memoryUsers.values()) {
          if (u._id === req.user.id) {
            currentUser = u;
            break;
          }
        }
      }

      if (currentUser) {
        if (currentUser.targetCareerId) targetCareerId = currentUser.targetCareerId;
        (currentUser.userSkills || []).forEach((us: any) => {
          userSkillMap.set(us.skillId, {
            skillId: us.skillId,
            proficiency: us.proficiency,
            status: us.status
          });
        });
      }
    }

    let targetCareerReqs: string[] = ['react', 'node-js', 'typescript', 'mongodb', 'system-design'];
    if (isMongoDbConnected()) {
      const c = await Career.findOne({ careerId: targetCareerId }).lean();
      if (c && c.requiredSkills) targetCareerReqs = c.requiredSkills.map(r => r.skillId);
    } else {
      const c = SEED_CAREERS.find(c => c.careerId === targetCareerId);
      if (c && c.requiredSkills) targetCareerReqs = c.requiredSkills.map(r => r.skillId);
    }

    const targetSkillIds = new Set(targetCareerReqs);

    const nodeDataList: SkillNodeData[] = allSkills.map(s => ({
      skillId: s.skillId,
      name: s.name,
      category: s.category,
      difficulty: s.difficulty,
      estimatedHours: s.estimatedHours,
      industryDemand: s.industryDemand,
      prerequisites: s.prerequisites || [],
      relatedSkills: s.relatedSkills || []
    }));

    const centralityMap = GraphEngine.calculateCentrality(nodeDataList);

    const nodes: any[] = [];
    const edges: any[] = [];

    const categoryPositions: { [key: string]: { x: number; y: number } } = {
      'Programming': { x: 0, y: 0 },
      'Frontend': { x: 380, y: -150 },
      'Backend': { x: 380, y: 150 },
      'Databases': { x: 760, y: 220 },
      'Cloud': { x: 760, y: -80 },
      'DevOps': { x: 1140, y: -80 },
      'AI': { x: 1140, y: 220 },
      'Data Science': { x: 1520, y: 220 },
      'Cyber Security': { x: 1520, y: -80 },
      'Soft Skills': { x: 0, y: 350 }
    };

    const categoryCounts: { [key: string]: number } = {};

    allSkills.forEach(s => {
      const userState = userSkillMap.get(s.skillId);
      const isTarget = targetSkillIds.has(s.skillId);

      let status: 'Mastered' | 'In Progress' | 'Target' | 'Locked' = 'Locked';
      if (userState && userState.status === 'Completed') {
        status = 'Mastered';
      } else if (userState && userState.status === 'Learning') {
        status = 'In Progress';
      } else if (isTarget) {
        status = 'Target';
      } else {
        const prereqs = s.prerequisites || [];
        const prereqsMet = prereqs.every(pId => userSkillMap.get(pId)?.status === 'Completed');
        if (prereqsMet || prereqs.length === 0) {
          status = 'Target';
        }
      }

      const catPos = categoryPositions[s.category] || { x: 0, y: 0 };
      const count = categoryCounts[s.category] || 0;
      categoryCounts[s.category] = count + 1;

      const col = count % 3;
      const row = Math.floor(count / 3);

      const posX = catPos.x + col * 120;
      const posY = catPos.y + row * 110;

      const centrality = centralityMap.get(s.skillId) || { inDegree: 0, outDegree: 0, centralityScore: 50 };

      nodes.push({
        id: s.skillId,
        type: 'skillNode',
        position: { x: posX, y: posY },
        data: {
          skillId: s.skillId,
          name: s.name,
          category: s.category,
          difficulty: s.difficulty,
          estimatedHours: s.estimatedHours,
          industryDemand: s.industryDemand,
          status,
          proficiency: userState?.proficiency || 0,
          isTarget,
          centralityScore: centrality.centralityScore,
          prerequisitesCount: s.prerequisites?.length || 0,
          unlocksCount: centrality.outDegree
        }
      });

      (s.prerequisites || []).forEach(prereqId => {
        edges.push({
          id: `e-${prereqId}-${s.skillId}`,
          source: prereqId,
          target: s.skillId,
          animated: status === 'In Progress' || status === 'Target',
          style: {
            stroke: status === 'Mastered' ? '#10b981' : status === 'In Progress' ? '#6366f1' : '#3f3f46',
            strokeWidth: status === 'Mastered' ? 2.5 : 1.5
          }
        });
      });
    });

    res.json({
      success: true,
      nodes,
      edges,
      stats: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        masteredCount: nodes.filter(n => n.data.status === 'Mastered').length,
        inProgressCount: nodes.filter(n => n.data.status === 'In Progress').length,
        targetCount: nodes.filter(n => n.data.status === 'Target').length
      }
    });
  } catch (error: any) {
    console.error('[Topology Error]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkillDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { skillId } = req.params;
    const allSkills = await getSkillsList();

    const skill = allSkills.find(s => s.skillId === skillId);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const skillsMap = new Map(allSkills.map(s => [s.skillId, s as unknown as SkillNodeData]));

    const prerequisitesDetails = (skill.prerequisites || []).map(pId => {
      const p = skillsMap.get(pId);
      return p ? { skillId: p.skillId, name: p.name, category: p.category, difficulty: p.difficulty } : null;
    }).filter(Boolean);

    const nextSkillsDetails = allSkills.filter(s => (s.prerequisites || []).includes(skillId)).map(s => ({
      skillId: s.skillId,
      name: s.name,
      category: s.category,
      difficulty: s.difficulty
    }));

    let userProficiency = 0;
    let userStatus = 'WantToLearn';
    let targetCareer = 'Software Engineer';

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
        targetCareer = currentUser.targetCareerId || 'Software Engineer';
        const uSkill = (currentUser.userSkills || []).find((us: any) => us.skillId === skillId);
        if (uSkill) {
          userProficiency = uSkill.proficiency;
          userStatus = uSkill.status;
        }
      }
    }

    const aiInsight = await AIService.explainSkill(skill.name, skill.category, targetCareer);

    res.json({
      success: true,
      skill,
      prerequisitesDetails,
      nextSkillsDetails,
      userState: {
        proficiency: userProficiency,
        status: userStatus
      },
      aiInsight
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserSkillProficiency = async (req: AuthRequest, res: Response) => {
  try {
    const { skillId, proficiency, status } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let userObj: any = null;

    if (isMongoDbConnected()) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const existingIndex = user.userSkills.findIndex(s => s.skillId === skillId);
      let xpGained = 25;
      if (existingIndex >= 0) {
        user.userSkills[existingIndex].proficiency = proficiency || user.userSkills[existingIndex].proficiency;
        user.userSkills[existingIndex].status = status || user.userSkills[existingIndex].status;
        user.userSkills[existingIndex].updatedAt = new Date();
      } else {
        user.userSkills.push({
          skillId,
          proficiency: proficiency || 1,
          status: status || 'Learning',
          updatedAt: new Date()
        });
        xpGained = 50;
      }
      user.xp += xpGained;
      user.level = Math.floor(user.xp / 200) + 1;
      await user.save();
      userObj = user.toObject();
    } else {
      for (const [email, u] of memoryUsers.entries()) {
        if (u._id === req.user.id) {
          const userSkills = u.userSkills || [];
          const existingIndex = userSkills.findIndex((s: any) => s.skillId === skillId);
          let xpGained = 25;

          if (existingIndex >= 0) {
            userSkills[existingIndex].proficiency = proficiency || userSkills[existingIndex].proficiency;
            userSkills[existingIndex].status = status || userSkills[existingIndex].status;
            userSkills[existingIndex].updatedAt = new Date().toISOString();
          } else {
            userSkills.push({
              skillId,
              proficiency: proficiency || 1,
              status: status || 'Learning',
              updatedAt: new Date().toISOString()
            });
            xpGained = 50;
          }

          u.userSkills = userSkills;
          u.xp = (u.xp || 200) + xpGained;
          u.level = Math.floor(u.xp / 200) + 1;
          memoryUsers.set(email, u);
          userObj = { ...u };
          break;
        }
      }
    }

    if (!userObj) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userSkills: userObj.userSkills,
      xpGained: 30,
      currentXp: userObj.xp,
      currentLevel: userObj.level
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
