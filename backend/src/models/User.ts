import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSkill {
  skillId: string;
  proficiency: number; // 1 (Beginner) to 5 (Master)
  status: 'Completed' | 'Learning' | 'WantToLearn';
  updatedAt: Date;
}

export interface IUserBadge {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface IUserRoadmapItem {
  skillId: string;
  status: 'Locked' | 'Available' | 'In Progress' | 'Completed';
  targetWeek: number;
  completedAt?: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: 'user' | 'admin';
  
  // Profile info
  college?: string;
  degree?: string;
  currentYear?: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  interests: string[];
  targetCareerId?: string;
  preferredLearningHours: number; // hrs per week
  preferredLearningStyle: 'Visual' | 'Hands-on' | 'Theoretical';
  githubProfile?: string;
  linkedinProfile?: string;
  resumeUrl?: string;

  // Skills & Graph State
  userSkills: IUserSkill[];
  roadmapItems: IUserRoadmapItem[];

  // Gamification & Progress
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: Date;
  badges: IUserBadge[];

  createdAt: Date;
  updatedAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>({
  skillId: { type: String, required: true },
  proficiency: { type: Number, default: 1, min: 1, max: 5 },
  status: { type: String, enum: ['Completed', 'Learning', 'WantToLearn'], default: 'WantToLearn' },
  updatedAt: { type: Date, default: Date.now }
});

const UserBadgeSchema = new Schema<IUserBadge>({
  badgeId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'Award' },
  unlockedAt: { type: Date, default: Date.now }
});

const UserRoadmapItemSchema = new Schema<IUserRoadmapItem>({
  skillId: { type: String, required: true },
  status: { type: String, enum: ['Locked', 'Available', 'In Progress', 'Completed'], default: 'Locked' },
  targetWeek: { type: Number, default: 1 },
  completedAt: { type: Date }
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    college: { type: String, default: 'Stanford University' },
    degree: { type: String, default: 'Computer Science' },
    currentYear: { type: String, default: 'Junior Year (3rd Year)' },
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    interests: [{ type: String }],
    targetCareerId: { type: String, default: 'fullstack-engineer' },
    preferredLearningHours: { type: Number, default: 10 },
    preferredLearningStyle: { type: String, enum: ['Visual', 'Hands-on', 'Theoretical'], default: 'Hands-on' },
    githubProfile: { type: String, default: 'https://github.com' },
    linkedinProfile: { type: String, default: 'https://linkedin.com' },
    resumeUrl: { type: String },

    userSkills: [UserSkillSchema],
    roadmapItems: [UserRoadmapItemSchema],

    xp: { type: Number, default: 450 },
    level: { type: Number, default: 3 },
    streakDays: { type: Number, default: 5 },
    lastActiveDate: { type: Date, default: Date.now },
    badges: [UserBadgeSchema]
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
