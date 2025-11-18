import { VercelRequest, VercelResponse } from '@vercel/node';

// Simple mock data for API responses
const mockContexts = [
  {
    id: '1',
    title: 'Pulse AI Research Notes',
    content: 'Researching AI-powered context management systems for cross-platform integration.',
    source: 'windows',
    platform: 'Windows 11',
    application: 'Notepad++',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    tags: ['research', 'ai', 'pulse-ai', 'notes']
  },
  {
    id: '2',
    title: 'Context Bridge Architecture',
    content: 'Designing a TypeScript/Node.js backend with React frontend for context management.',
    source: 'web',
    platform: 'Chrome',
    url: 'https://github.com/pulse-ai/context-bridge',
    timestamp: new Date('2024-01-15T11:15:00Z'),
    tags: ['architecture', 'typescript', 'react', 'nodejs']
  }
];

const mockInsights = [
  {
    id: '1',
    title: 'Cross-Platform Development Pattern',
    description: 'Multiple contexts show focus on cross-platform compatibility.',
    type: 'pattern',
    confidence: 0.92,
    relatedContexts: ['1', '2'],
    timestamp: new Date('2024-01-15T17:00:00Z')
  }
];

// CORS headers helper
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Main handler function
export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url?.replace('/api', '') || '/';

  console.log(`API Request: ${method} ${path}`);

  try {
    // Health check endpoint
    if (path === '/health') {
      return res.status(200).json({
        success: true,
        data: {
          status: 'Context Bridge API is running on Vercel',
          environment: process.env.NODE_ENV || 'production',
          timestamp: new Date().toISOString(),
          platform: 'vercel'
        }
      });
    }

    // Context endpoints
    if (path === '/context' && method === 'GET') {
      return res.status(200).json({
        success: true,
        data: mockContexts,
        message: `Retrieved ${mockContexts.length} contexts`
      });
    }

    if (path === '/context' && method === 'POST') {
      const newContext = {
        ...req.body,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      mockContexts.unshift(newContext);
      
      return res.status(201).json({
        success: true,
        data: newContext,
        message: 'Context added successfully'
      });
    }

    // Insights endpoints
    if (path === '/insights' && method === 'GET') {
      return res.status(200).json({
        success: true,
        data: mockInsights,
        message: `Retrieved ${mockInsights.length} insights`
      });
    }

    // Root endpoint
    if (path === '/' || path === '') {
      return res.status(200).json({
        success: true,
        data: {
          message: 'Context Bridge API',
          endpoints: ['/health', '/context', '/insights'],
          timestamp: new Date().toISOString()
        }
      });
    }

    // 404 for unknown routes
    return res.status(404).json({
      success: false,
      error: 'API endpoint not found',
      path: path,
      method: method,
      available: ['/health', '/context', '/insights']
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}