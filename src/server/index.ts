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
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== 'production';

// CORS configuration
const corsOptions = {
  origin: isDev 
    ? ['http://localhost:3000', 'http://localhost:5173']
    : process.env.FRONTEND_URL || true,
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files in production
if (!isDev) {
  const staticPath = path.join(__dirname, '../client');
  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));
}

// Routes
app.use('/api/context', contextRoutes);
app.use('/api/insights', insightRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Context Bridge API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    staticPath: !isDev ? path.join(__dirname, '../client') : 'dev mode'
  });
});

// Handle client-side routing in production
if (!isDev) {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '../client/index.html');
    console.log(`Serving index.html from: ${indexPath}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Server Error');
      }
    });
  });
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`Context Bridge server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});