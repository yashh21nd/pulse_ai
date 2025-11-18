import { Router, Request, Response } from 'express';
import { ContextAnalyzer } from '../services/contextAnalyzer';
import { ApiResponse, AddContextRequest, ContextAnalysisRequest } from '../types';

const router = Router();
const contextAnalyzer = new ContextAnalyzer();

// GET /api/contexts - Get all contexts
router.get('/', (req: Request, res: Response) => {
  try {
    const contexts = contextAnalyzer.getAllContexts();
    
    const response: ApiResponse<typeof contexts> = {
      success: true,
      data: contexts,
      message: `Retrieved ${contexts.length} contexts`
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    res.status(500).json(response);
  }
});

// GET /api/contexts/:id - Get specific context
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const context = contextAnalyzer.getContext(id);
    
    if (!context) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Context with id ${id} not found`
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof context> = {
      success: true,
      data: context
    };
    
    return res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    return res.status(500).json(response);
  }
});

// POST /api/contexts - Add new context
router.post('/', (req: Request, res: Response) => {
  try {
    const contextData: AddContextRequest = req.body;
    
    // Validate required fields
    if (!contextData.title || !contextData.content || !contextData.source) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Title, content, and source are required fields'
      };
      return res.status(400).json(response);
    }
    
    // Validate source
    if (!['windows', 'macos', 'web'].includes(contextData.source)) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Source must be one of: windows, macos, web'
      };
      return res.status(400).json(response);
    }
    
    const newContext = contextAnalyzer.addContext({
      title: contextData.title,
      content: contextData.content,
      source: contextData.source,
      platform: contextData.platform || contextData.source,
      ...(contextData.application && { application: contextData.application }),
      ...(contextData.url && { url: contextData.url }),
      tags: contextData.tags || []
    });
    
    const response: ApiResponse<typeof newContext> = {
      success: true,
      data: newContext,
      message: 'Context added successfully'
    };
    
    return res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    return res.status(500).json(response);
  }
});

// POST /api/contexts/:id/analyze - Analyze specific context
router.post('/:id/analyze', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const options: ContextAnalysisRequest = req.body || {};
    
    const context = contextAnalyzer.getContext(id);
    if (!context) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Context with id ${id} not found`
      };
      return res.status(404).json(response);
    }
    
    const analysisResult = contextAnalyzer.analyzeContext(id);
    
    const response: ApiResponse<typeof analysisResult> = {
      success: true,
      data: analysisResult,
      message: 'Context analysis completed'
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    res.status(500).json(response);
  }
});

// GET /api/contexts/stats - Get context statistics
router.get('/api/stats', (req: Request, res: Response) => {
  try {
    const contexts = contextAnalyzer.getAllContexts();
    const insights = contextAnalyzer.getAllInsights();
    const connections = contextAnalyzer.getAllConnections();
    
    const platformBreakdown = contexts.reduce((acc, context) => {
      acc[context.source] = (acc[context.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const stats = {
      totalContexts: contexts.length,
      totalInsights: insights.length,
      totalConnections: connections.length,
      platformBreakdown
    };
    
    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    res.status(500).json(response);
  }
});

// GET /api/contexts/connections - Get all connections
router.get('/connections/all', (req: Request, res: Response) => {
  try {
    const connections = contextAnalyzer.getAllConnections();
    
    const response: ApiResponse<typeof connections> = {
      success: true,
      data: connections
    };
    
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
    
    res.status(500).json(response);
  }
});

export default router;