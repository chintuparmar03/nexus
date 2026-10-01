import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'nexus_super_secret_jwt_key_2026_production_ready';

// In-Memory User Store Fallback when local MongoDB server is not active
export const memoryUsers: Map<string, any> = new Map();

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

export const isMongoDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      college,
      degree,
      currentYear,
      experienceLevel,
      targetCareerId,
      preferredLearningHours,
      initialSkillIds
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userSkills = Array.isArray(initialSkillIds)
      ? initialSkillIds.map((sId: string) => ({
          skillId: sId,
          proficiency: 4,
          status: 'Completed',
          updatedAt: new Date()
        }))
      : [];

    const baseUserData: any = {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      college: college || 'University Student',
      degree: degree || 'Computer Science',
      currentYear: currentYear || '3rd Year',
      experienceLevel: experienceLevel || 'Intermediate',
      targetCareerId: targetCareerId || 'fullstack-engineer',
      preferredLearningHours: Number(preferredLearningHours) || 10,
      preferredLearningStyle: 'Hands-on',
      userSkills,
      xp: 250,
      level: 1,
      streakDays: 1,
      badges: [
        {
          badgeId: 'nexus-welcome',
          name: 'Graph Pioneer',
          description: 'Registered on NEXUS Skill Knowledge Graph Platform',
          icon: 'Sparkles',
          unlockedAt: new Date()
        }
      ],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };

    let userObj: any = null;

    if (isMongoDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
      const mongoUser = await User.create(baseUserData);
      userObj = mongoUser.toObject();
    } else {
      if (memoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
      userObj = { ...baseUserData, _id: `user-${Date.now()}` };
      memoryUsers.set(normalizedEmail, userObj);
    }

    const token = generateToken(userObj._id.toString(), userObj.role || 'user');
    delete userObj.password;

    res.status(201).json({
      success: true,
      token,
      user: userObj
    });
  } catch (error: any) {
    console.error('[Register Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let userObj: any = null;

    if (isMongoDbConnected()) {
      const dbUser = await User.findOne({ email: normalizedEmail });
      if (dbUser && dbUser.password) {
        const isMatch = await bcrypt.compare(password, dbUser.password);
        if (isMatch) {
          userObj = dbUser.toObject();
        }
      }
    } else {
      const memUser = memoryUsers.get(normalizedEmail);
      if (memUser && memUser.password) {
        const isMatch = await bcrypt.compare(password, memUser.password);
        if (isMatch) {
          userObj = { ...memUser };
        }
      }
    }

    if (!userObj) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(userObj._id.toString(), userObj.role || 'user');
    delete userObj.password;

    res.json({
      success: true,
      token,
      user: userObj
    });
  } catch (error: any) {
    console.error('[Login Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Login failed' });
  }
};

export const googleAuthMock = async (req: Request, res: Response) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    const normalizedEmail = (email || `dev-${Date.now()}@gmail.com`).toLowerCase().trim();

    let userObj: any = null;

    if (isMongoDbConnected()) {
      let dbUser = await User.findOne({ email: normalizedEmail });
      if (!dbUser) {
        dbUser = await User.create({
          name: name || 'Google Developer',
          email: normalizedEmail,
          googleId: googleId || `google-${Date.now()}`,
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          userSkills: [
            { skillId: 'javascript', proficiency: 4, status: 'Completed', updatedAt: new Date() },
            { skillId: 'html-css', proficiency: 4, status: 'Completed', updatedAt: new Date() }
          ],
          xp: 300,
          level: 2,
          streakDays: 1,
          badges: [
            {
              badgeId: 'google-oauth',
              name: 'Verified Engineer',
              description: 'Authenticated via Google Single Sign-On',
              icon: 'CheckCircle',
              unlockedAt: new Date()
            }
          ]
        });
      }
      userObj = dbUser.toObject();
    } else {
      if (!memoryUsers.has(normalizedEmail)) {
        memoryUsers.set(normalizedEmail, {
          _id: `google-user-${Date.now()}`,
          name: name || 'Google Developer',
          email: normalizedEmail,
          googleId: googleId || `google-${Date.now()}`,
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          role: 'user',
          college: 'University Student',
          degree: 'Computer Science',
          experienceLevel: 'Intermediate',
          targetCareerId: 'fullstack-engineer',
          preferredLearningHours: 10,
          userSkills: [
            { skillId: 'javascript', proficiency: 4, status: 'Completed', updatedAt: new Date().toISOString() },
            { skillId: 'html-css', proficiency: 4, status: 'Completed', updatedAt: new Date().toISOString() }
          ],
          xp: 300,
          level: 2,
          streakDays: 1,
          badges: [
            {
              badgeId: 'google-oauth',
              name: 'Verified Engineer',
              description: 'Authenticated via Google Single Sign-On',
              icon: 'CheckCircle',
              unlockedAt: new Date().toISOString()
            }
          ]
        });
      }
      userObj = { ...memoryUsers.get(normalizedEmail) };
    }

    const token = generateToken(userObj._id.toString(), userObj.role || 'user');
    delete userObj.password;

    res.json({
      success: true,
      token,
      user: userObj
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    let userObj: any = null;

    if (isMongoDbConnected()) {
      userObj = await User.findById(userId).select('-password').lean();
    } else {
      for (const u of memoryUsers.values()) {
        if (u._id === userId) {
          userObj = { ...u };
          delete userObj.password;
          break;
        }
      }
    }

    if (!userObj) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: userObj });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    const updates = req.body;
    delete updates.password;
    delete updates.email;
    delete updates.role;

    let userObj: any = null;

    if (isMongoDbConnected()) {
      userObj = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true }).select('-password').lean();
    } else {
      for (const [e, u] of memoryUsers.entries()) {
        if (u._id === userId) {
          const updated = { ...u, ...updates };
          memoryUsers.set(e, updated);
          userObj = { ...updated };
          delete userObj.password;
          break;
        }
      }
    }

    res.json({ success: true, user: userObj });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
