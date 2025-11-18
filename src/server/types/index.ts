export interface Context {
  id: string;
  title: string;
  content: string;
  source: 'windows' | 'macos' | 'web';
  platform: string;
  application?: string;
  url?: string;
  timestamp: Date;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'pattern' | 'connection' | 'trend' | 'recommendation';
  confidence: number;
  relatedContexts: string[];
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'semantic' | 'temporal' | 'source' | 'user-defined';
  strength: number;
  description: string;
  timestamp: Date;
}

export interface AnalysisResult {
  insights: Insight[];
  connections: Connection[];
  tags: string[];
  confidence: number;
}

export interface ContextAnalysisRequest {
  contextId: string;
  includeRelated?: boolean;
  analysisType?: 'full' | 'quick' | 'connections-only';
}

export interface InsightGenerationRequest {
  contextIds: string[];
  type?: 'pattern' | 'connection' | 'trend' | 'recommendation';
  minConfidence?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContextStats {
  totalContexts: number;
  totalInsights: number;
  totalConnections: number;
  platformBreakdown: Record<string, number>;
}

export interface AddContextRequest {
  title: string;
  content: string;
  source: 'windows' | 'macos' | 'web';
  platform: string;
  application?: string;
  url?: string;
  tags: string[];
}