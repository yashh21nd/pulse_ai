import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contextRoutes from './routes/context';
import insightRoutes from './routes/insights';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist/client'));

// Routes
app.use('/api/context', contextRoutes);
app.use('/api/insights', insightRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Context Bridge API is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Context Bridge server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});