export interface SkillNodeData {
  skillId: string;
  name: string;
  category: string;
  difficulty: string;
  estimatedHours: number;
  industryDemand: string;
  prerequisites: string[];
  relatedSkills: string[];
}

export interface UserSkillState {
  skillId: string;
  proficiency: number; // 1-5
  status: 'Completed' | 'Learning' | 'WantToLearn';
}

export interface CareerRequirementData {
  skillId: string;
  importanceWeight: number; // 1-10
  targetProficiency: number; // 1-5
  isMustHave: boolean;
}

export interface ReadinessResult {
  readinessPercentage: number;
  confidenceScore: number;
  completedRequiredCount: number;
  totalRequiredCount: number;
  missingSkillIds: string[];
  missingMustHaveIds: string[];
  totalEstimatedHoursLeft: number;
  estimatedWeeks: number;
  learningVelocity: number;
  skillBreakdown: Array<{
    skillId: string;
    importanceWeight: number;
    targetProficiency: number;
    currentProficiency: number;
    status: 'Mastered' | 'In Progress' | 'Missing' | 'Locked';
    prerequisitesMet: boolean;
  }>;
}

export interface RoadmapStage {
  stageNumber: number;
  title: string;
  description: string;
  skills: Array<{
    skillId: string;
    estimatedHours: number;
    difficulty: string;
    prerequisites: string[];
    importanceWeight?: number;
    unlockedBy: string[];
  }>;
}

export class GraphEngine {
  /**
   * Kahn's Algorithm for Topological Sorting & Cycle Detection
   */
  public static topologicalSort(skills: SkillNodeData[]): { sortedIds: string[]; hasCycle: boolean } {
    const inDegree: Map<string, number> = new Map();
    const adj: Map<string, string[]> = new Map();

    skills.forEach(s => {
      inDegree.set(s.skillId, 0);
      adj.set(s.skillId, []);
    });

    skills.forEach(s => {
      s.prerequisites.forEach(prereqId => {
        if (adj.has(prereqId)) {
          adj.get(prereqId)!.push(s.skillId);
          inDegree.set(s.skillId, (inDegree.get(s.skillId) || 0) + 1);
        }
      });
    });

    const queue: string[] = [];
    inDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const sortedIds: string[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      sortedIds.push(u);

      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        const newDegree = (inDegree.get(v) || 1) - 1;
        inDegree.set(v, newDegree);
        if (newDegree === 0) {
          queue.push(v);
        }
      }
    }

    const hasCycle = sortedIds.length !== skills.length;
    return { sortedIds, hasCycle };
  }

  /**
   * Traverses recursive prerequisite chain for any target skill
   */
  public static getAllPrerequisites(targetSkillId: string, skillsMap: Map<string, SkillNodeData>): string[] {
    const visited = new Set<string>();

    const dfs = (id: string) => {
      const skill = skillsMap.get(id);
      if (!skill) return;

      for (const prereqId of skill.prerequisites) {
        if (!visited.has(prereqId)) {
          visited.add(prereqId);
          dfs(prereqId);
        }
      }
    };

    dfs(targetSkillId);
    return Array.from(visited);
  }

  /**
   * Computes Centrality Metrics (In-degree, Out-degree, Bottleneck score)
   */
  public static calculateCentrality(skills: SkillNodeData[]): Map<string, { inDegree: number; outDegree: number; centralityScore: number }> {
    const result = new Map<string, { inDegree: number; outDegree: number; centralityScore: number }>();
    const inDegreeMap = new Map<string, number>();
    const outDegreeMap = new Map<string, number>();

    skills.forEach(s => {
      inDegreeMap.set(s.skillId, s.prerequisites.length);
      outDegreeMap.set(s.skillId, 0);
    });

    skills.forEach(s => {
      s.prerequisites.forEach(prereqId => {
        outDegreeMap.set(prereqId, (outDegreeMap.get(prereqId) || 0) + 1);
      });
    });

    skills.forEach(s => {
      const inDeg = inDegreeMap.get(s.skillId) || 0;
      const outDeg = outDegreeMap.get(s.skillId) || 0;
      // High out-degree means this skill is a prerequisite for many other skills (Foundational Hub)
      // High in-degree means it depends on many things (Advanced Capstone)
      const centralityScore = Math.min(100, Math.round(outDeg * 15 + inDeg * 5));

      result.set(s.skillId, {
        inDegree: inDeg,
        outDegree: outDeg,
        centralityScore
      });
    });

    return result;
  }

  /**
   * Dijkstra / BFS Shortest Path to reach a target skill from user's current mastered skills
   */
  public static getShortestLearningPath(
    targetSkillId: string,
    userMasteredSet: Set<string>,
    skillsMap: Map<string, SkillNodeData>
  ): string[] {
    if (userMasteredSet.has(targetSkillId)) return [];

    const neededPrereqs = this.getAllPrerequisites(targetSkillId, skillsMap);
    neededPrereqs.push(targetSkillId);

    // Filter out already mastered skills
    const unmasteredNeeded = neededPrereqs.filter(id => !userMasteredSet.has(id));

    // Sort topologically
    const relevantSkills = unmasteredNeeded.map(id => skillsMap.get(id)).filter(Boolean) as SkillNodeData[];
    const { sortedIds } = this.topologicalSort(relevantSkills);

    return sortedIds;
  }

  /**
   * Mathematical Career Readiness Calculator (Deterministic backend engine)
   */
  public static calculateCareerReadiness(
    careerRequirements: CareerRequirementData[],
    userSkillMap: Map<string, UserSkillState>,
    skillsMap: Map<string, SkillNodeData>,
    weeklyHours: number = 10
  ): ReadinessResult {
    if (careerRequirements.length === 0) {
      return {
        readinessPercentage: 0,
        confidenceScore: 100,
        completedRequiredCount: 0,
        totalRequiredCount: 0,
        missingSkillIds: [],
        missingMustHaveIds: [],
        totalEstimatedHoursLeft: 0,
        estimatedWeeks: 0,
        learningVelocity: weeklyHours,
        skillBreakdown: []
      };
    }

    let totalWeight = 0;
    let weightedProficiencySum = 0;
    let completedRequiredCount = 0;
    const missingSkillIds: string[] = [];
    const missingMustHaveIds: string[] = [];
    let totalEstimatedHoursLeft = 0;

    const skillBreakdown = careerRequirements.map(req => {
      const userSkill = userSkillMap.get(req.skillId);
      const skillDetail = skillsMap.get(req.skillId);

      const currentProf = userSkill?.proficiency || 0;
      const targetProf = req.targetProficiency;
      const weight = req.importanceWeight;

      totalWeight += weight;

      // Calculate ratio (capped at 1.0)
      const profRatio = Math.min(1.0, currentProf / targetProf);
      weightedProficiencySum += profRatio * weight;

      // Prerequisites check
      const prereqs = skillDetail?.prerequisites || [];
      const prereqsMet = prereqs.every(pId => {
        const pSkill = userSkillMap.get(pId);
        return pSkill && (pSkill.status === 'Completed' || pSkill.proficiency >= 3);
      });

      let status: 'Mastered' | 'In Progress' | 'Missing' | 'Locked' = 'Missing';
      if (currentProf >= targetProf) {
        status = 'Mastered';
        completedRequiredCount++;
      } else if (currentProf > 0) {
        status = 'In Progress';
      } else if (!prereqsMet && prereqs.length > 0) {
        status = 'Locked';
      }

      if (status !== 'Mastered') {
        missingSkillIds.push(req.skillId);
        if (req.isMustHave) {
          missingMustHaveIds.push(req.skillId);
        }

        // Add remaining learning hours needed for this skill
        const totalHours = skillDetail?.estimatedHours || 20;
        const remainingRatio = 1 - profRatio;
        totalEstimatedHoursLeft += Math.round(totalHours * remainingRatio);
      }

      return {
        skillId: req.skillId,
        importanceWeight: weight,
        targetProficiency: targetProf,
        currentProficiency: currentProf,
        status,
        prerequisitesMet: prereqsMet
      };
    });

    // Base math score 0-100
    const rawReadiness = (weightedProficiencySum / totalWeight) * 100;

    // Prerequisite penalty multiplier: if must-have prerequisite skills are missing, readiness confidence drops
    const mustHaveRatio = (careerRequirements.filter(r => r.isMustHave).length - missingMustHaveIds.length) / Math.max(1, careerRequirements.filter(r => r.isMustHave).length);
    const confidenceScore = Math.round(70 + mustHaveRatio * 30);

    const readinessPercentage = Math.min(100, Math.round(rawReadiness));
    const estimatedWeeks = Math.ceil(totalEstimatedHoursLeft / Math.max(1, weeklyHours));

    return {
      readinessPercentage,
      confidenceScore,
      completedRequiredCount,
      totalRequiredCount: careerRequirements.length,
      missingSkillIds,
      missingMustHaveIds,
      totalEstimatedHoursLeft,
      estimatedWeeks,
      learningVelocity: weeklyHours,
      skillBreakdown
    };
  }

  /**
   * Generates interactive multi-stage roadmap
   */
  public static generateInteractiveRoadmap(
    careerRequirements: CareerRequirementData[],
    userSkillMap: Map<string, UserSkillState>,
    skillsMap: Map<string, SkillNodeData>
  ): RoadmapStage[] {
    // Collect all skills needed (target skills + missing prerequisite chain)
    const allNeededSkillIds = new Set<string>();

    careerRequirements.forEach(req => {
      allNeededSkillIds.add(req.skillId);
      const prereqs = this.getAllPrerequisites(req.skillId, skillsMap);
      prereqs.forEach(p => allNeededSkillIds.add(p));
    });

    const neededSkillsList = Array.from(allNeededSkillIds)
      .map(id => skillsMap.get(id))
      .filter(Boolean) as SkillNodeData[];

    // Sort topologically
    const { sortedIds } = this.topologicalSort(neededSkillsList);

    // Group into 4 stages: Fundamentals, Core Stack, Advanced Tooling, Mastery & Projects
    const stage1: RoadmapStage['skills'] = [];
    const stage2: RoadmapStage['skills'] = [];
    const stage3: RoadmapStage['skills'] = [];
    const stage4: RoadmapStage['skills'] = [];

    sortedIds.forEach(id => {
      const skill = skillsMap.get(id);
      if (!skill) return;

      const req = careerRequirements.find(r => r.skillId === id);
      const item = {
        skillId: id,
        estimatedHours: skill.estimatedHours,
        difficulty: skill.difficulty,
        prerequisites: skill.prerequisites,
        importanceWeight: req?.importanceWeight || 5,
        unlockedBy: skill.prerequisites
      };

      if (skill.difficulty === 'Beginner' && skill.prerequisites.length <= 1) {
        stage1.push(item);
      } else if (skill.difficulty === 'Beginner' || (skill.difficulty === 'Intermediate' && skill.prerequisites.length <= 2)) {
        stage2.push(item);
      } else if (skill.difficulty === 'Intermediate' || (req && req.isMustHave)) {
        stage3.push(item);
      } else {
        stage4.push(item);
      }
    });

    return [
      {
        stageNumber: 1,
        title: 'Phase 1: Foundations & Core Concepts',
        description: 'Master foundational concepts and absolute prerequisites required before building software.',
        skills: stage1
      },
      {
        stageNumber: 2,
        title: 'Phase 2: Modern Tech Stack & Architecture',
        description: 'Core tools, frameworks, and database implementations used daily in high-tech roles.',
        skills: stage2
      },
      {
        stageNumber: 3,
        title: 'Phase 3: Deep Technical Mastery & DevOps',
        description: 'Advanced patterns, cloud infrastructure, testing, and production deployment pipeline.',
        skills: stage3
      },
      {
        stageNumber: 4,
        title: 'Phase 4: Capstone Engineering & Specialization',
        description: 'High-impact system architecture, performance optimization, and interview capstones.',
        skills: stage4
      }
    ].filter(stage => stage.skills.length > 0);
  }
}
