import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import contextRoutes from '../src/server/routes/context';
import insightRoutes from '../src/server/routes/insights';

const app = express();

// CORS configuration for Vercel
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://*.vercel.app',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes (no /api prefix needed since Vercel routes /api/* to this function)
app.use('/context', contextRoutes);
app.use('/insights', insightRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Context Bridge API is running on Vercel',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    platform: 'vercel',
    url: process.env.VERCEL_URL || 'localhost'
  });
});

// Root API endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Context Bridge API',
    endpoints: ['/health', '/context', '/insights'],
    timestamp: new Date().toISOString()
  });
});

// Catch all routes
app.all('/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Export handler for Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};