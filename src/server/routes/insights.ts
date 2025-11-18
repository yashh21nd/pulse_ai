import { Router, Request, Response } from 'express';
import { InsightGenerator } from '../services/insightGenerator';
import { ApiResponse, InsightGenerationRequest } from '../types';

const router = Router();
const insightGenerator = new InsightGenerator();

// GET /api/insights - Get all insights
router.get('/', (req: Request, res: Response) => {
  try {
    const { type, minConfidence, limit } = req.query;
    
    let insights;
    
    if (type && typeof type === 'string') {
      const validTypes = ['pattern', 'connection', 'trend', 'recommendation'];
      if (!validTypes.includes(type)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid insight type. Must be one of: pattern, connection, trend, recommendation'
        };
        return res.status(400).json(response);
      }
      insights = insightGenerator.getInsightsByType(type as any);
    } else if (minConfidence && typeof minConfidence === 'string') {
      const confidence = parseFloat(minConfidence);
      if (isNaN(confidence) || confidence < 0 || confidence > 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid confidence value. Must be a number between 0 and 1'
        };
        return res.status(400).json(response);
      }
      insights = insightGenerator.getInsightsByConfidence(confidence);
    } else if (limit && typeof limit === 'string') {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid limit value. Must be a positive number'
        };
        return res.status(400).json(response);
      }
      insights = insightGenerator.getTopInsights(limitNum);
    } else {
      insights = insightGenerator.getAllInsights();
    }
    
    const response: ApiResponse<typeof insights> = {
      success: true,
      data: insights,
      message: `Retrieved ${insights.length} insights`
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

// GET /api/insights/:id - Get specific insight
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const insight = insightGenerator.getInsight(id);
    
    if (!insight) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Insight with id ${id} not found`
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<typeof insight> = {
      success: true,
      data: insight
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

// POST /api/insights/generate - Generate insights for specific contexts
router.post('/generate', (req: Request, res: Response) => {
  try {
    const request: InsightGenerationRequest = req.body;
    
    if (!request.contextIds || !Array.isArray(request.contextIds) || request.contextIds.length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'contextIds array is required and must not be empty'
      };
      return res.status(400).json(response);
    }
    
    const options: {
      type?: 'pattern' | 'connection' | 'trend' | 'recommendation';
      minConfidence?: number;
    } = {};
    
    if (request.type) {
      const validTypes = ['pattern', 'connection', 'trend', 'recommendation'];
      if (!validTypes.includes(request.type)) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid insight type. Must be one of: pattern, connection, trend, recommendation'
        };
        return res.status(400).json(response);
      }
      options.type = request.type;
    }
    
    if (request.minConfidence !== undefined) {
      if (request.minConfidence < 0 || request.minConfidence > 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'minConfidence must be between 0 and 1'
        };
        return res.status(400).json(response);
      }
      options.minConfidence = request.minConfidence;
    }
    
    const insights = insightGenerator.generateInsights(request.contextIds, options);
    
    const response: ApiResponse<typeof insights> = {
      success: true,
      data: insights,
      message: `Generated ${insights.length} insights for ${request.contextIds.length} contexts`
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

// GET /api/insights/connections - Get all connections
router.get('/connections/all', (req: Request, res: Response) => {
  try {
    const connections = insightGenerator.getConnections();
    
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

// GET /api/insights/connections/:contextId - Get connections for specific context
router.get('/connections/:contextId', (req: Request, res: Response) => {
  try {
    const { contextId } = req.params;
    const connections = insightGenerator.getConnectionsByContext(contextId);
    
    const response: ApiResponse<typeof connections> = {
      success: true,
      data: connections,
      message: `Retrieved ${connections.length} connections for context ${contextId}`
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

// GET /api/insights/top/:limit? - Get top insights by confidence
router.get('/top/:limit?', (req: Request, res: Response) => {
  try {
    const limitParam = req.params.limit;
    let limit = 5; // default
    
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Invalid limit parameter. Must be a positive number'
        };
        return res.status(400).json(response);
      }
      limit = parsedLimit;
    }
    
    const insights = insightGenerator.getTopInsights(limit);
    
    const response: ApiResponse<typeof insights> = {
      success: true,
      data: insights,
      message: `Retrieved top ${insights.length} insights`
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