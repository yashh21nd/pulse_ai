import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import contextRoutes from './routes/context';
import insightRoutes from './routes/insights';

// Load environment variables
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

const app = express();

// CORS configuration for Vercel
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://context-bridge.vercel.app',
    process.env.FRONTEND_URL || 'https://context-bridge.vercel.app'
  ],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/context', contextRoutes);
app.use('/api/insights', insightRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Context Bridge API is running on Vercel',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    platform: 'vercel'
  });
});

// Export for Vercel serverless functions
export default app;