import mongoose, { Schema, Document } from 'mongoose';

export interface IResource {
  title: string;
  type: 'Doc' | 'YouTube' | 'Course' | 'GitHub' | 'Practice' | 'Book';
  url: string;
  isFree: boolean;
}

export interface ISkill extends Document {
  skillId: string;
  name: string;
  description: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'AI' | 'Cloud' | 'DevOps' | 'Databases' | 'Data Science' | 'Cyber Security' | 'Soft Skills';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  industryDemand: 'Very High' | 'High' | 'Medium' | 'Low';
  popularity: number; // 1-100
  prerequisites: string[]; // array of skillIds
  relatedSkills: string[]; // array of skillIds
  resources: IResource[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  type: { type: String, enum: ['Doc', 'YouTube', 'Course', 'GitHub', 'Practice', 'Book'], required: true },
  url: { type: String, required: true },
  isFree: { type: Boolean, default: true }
});

const SkillSchema = new Schema<ISkill>(
  {
    skillId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Programming', 'Frontend', 'Backend', 'AI', 'Cloud', 'DevOps', 'Databases', 'Data Science', 'Cyber Security', 'Soft Skills'],
      required: true,
      index: true
    },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    estimatedHours: { type: Number, required: true, default: 20 },
    industryDemand: { type: String, enum: ['Very High', 'High', 'Medium', 'Low'], required: true, default: 'High' },
    popularity: { type: Number, default: 80 },
    prerequisites: [{ type: String }],
    relatedSkills: [{ type: String }],
    resources: [ResourceSchema]
  },
  { timestamps: true }
);

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
