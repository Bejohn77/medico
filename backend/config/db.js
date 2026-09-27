import mongoose from 'mongoose';
import './env.js';

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw Object.assign(new Error('MONGODB_URI is not configured.'), { code: 'MONGODB_CONFIG' });
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch {
    throw Object.assign(new Error('MongoDB connection failed.'), { code: 'MONGODB_CONNECTION' });
  }
  console.log('MongoDB connected');
}
