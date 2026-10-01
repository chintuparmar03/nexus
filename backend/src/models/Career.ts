import mongoose, { Schema, Document } from 'mongoose';

export interface ICareerSkillRequirement {
  skillId: string;
  importanceWeight: number; // 1 to 10
  targetProficiency: number; // 1 to 5 (1: Beginner, 5: Master)
  isMustHave: boolean;
}

export interface ICareer extends Document {
  careerId: string;
  title: string;
  description: string;
  category: string;
  requiredSkills: ICareerSkillRequirement[];
  averageSalary: string;
  industryDemand: 'Very High' | 'High' | 'Medium';
  futureGrowth: string;
  iconName: string;
  keyResponsibilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CareerSkillRequirementSchema = new Schema<ICareerSkillRequirement>({
  skillId: { type: String, required: true },
  importanceWeight: { type: Number, required: true, min: 1, max: 10, default: 5 },
  targetProficiency: { type: Number, required: true, min: 1, max: 5, default: 4 },
  isMustHave: { type: Boolean, default: true }
});

const CareerSchema = new Schema<ICareer>(
  {
    careerId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'Engineering' },
    requiredSkills: [CareerSkillRequirementSchema],
    averageSalary: { type: String, default: '$110,000 / yr' },
    industryDemand: { type: String, enum: ['Very High', 'High', 'Medium'], default: 'High' },
    futureGrowth: { type: String, default: '+22% growth' },
    iconName: { type: String, default: 'Code' },
    keyResponsibilities: [{ type: String }]
  },
  { timestamps: true }
);

export const Career = mongoose.model<ICareer>('Career', CareerSchema);
