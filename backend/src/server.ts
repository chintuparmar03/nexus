import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import skillRoutes from './routes/skillRoutes';
import careerRoutes from './routes/careerRoutes';
import roadmapRoutes from './routes/roadmapRoutes';
import adminRoutes from './routes/adminRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NEXUS Career Intelligence Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`[NEXUS Server] Running on http://localhost:${PORT}`);
});
