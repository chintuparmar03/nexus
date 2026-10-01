import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexus_db';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[DB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[DB Warning] Running with fallback memory store mode if Mongo is unavailable.`);
  }
};
