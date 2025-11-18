import { Context, Insight, Connection, ApiResponse, AddContextRequest, ContextStats } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Context endpoints
  async getContexts(): Promise<ApiResponse<Context[]>> {
    return this.request<Context[]>('/contexts');
  }

  async getContext(id: string): Promise<ApiResponse<Context>> {
    return this.request<Context>(`/contexts/${id}`);
  }

  async addContext(context: AddContextRequest): Promise<ApiResponse<Context>> {
    return this.request<Context>('/contexts', {
      method: 'POST',
      body: JSON.stringify(context),
    });
  }

  async analyzeContext(id: string): Promise<ApiResponse<{
    insights: Insight[];
    connections: Connection[];
    tags: string[];
    confidence: number;
  }>> {
    return this.request(`/contexts/${id}/analyze`, {
      method: 'POST',
    });
  }

  async getContextStats(): Promise<ApiResponse<ContextStats>> {
    return this.request<ContextStats>('/contexts/api/stats');
  }

  // Insights endpoints
  async getInsights(params?: {
    type?: 'pattern' | 'connection' | 'trend' | 'recommendation';
    minConfidence?: number;
    limit?: number;
  }): Promise<ApiResponse<Insight[]>> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.minConfidence !== undefined) queryParams.append('minConfidence', params.minConfidence.toString());
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    return this.request<Insight[]>(`/insights${query ? `?${query}` : ''}`);
  }

  async getInsight(id: string): Promise<ApiResponse<Insight>> {
    return this.request<Insight>(`/insights/${id}`);
  }

  async generateInsights(contextIds: string[], options?: {
    type?: 'pattern' | 'connection' | 'trend' | 'recommendation';
    minConfidence?: number;
  }): Promise<ApiResponse<Insight[]>> {
    return this.request<Insight[]>('/insights/generate', {
      method: 'POST',
      body: JSON.stringify({
        contextIds,
        ...options,
      }),
    });
  }

  async getTopInsights(limit: number = 5): Promise<ApiResponse<Insight[]>> {
    return this.request<Insight[]>(`/insights/top/${limit}`);
  }

  // Connections endpoints
  async getAllConnections(): Promise<ApiResponse<Connection[]>> {
    return this.request<Connection[]>('/insights/connections/all');
  }

  async getConnectionsForContext(contextId: string): Promise<ApiResponse<Connection[]>> {
    return this.request<Connection[]>(`/insights/connections/${contextId}`);
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Helper functions for common operations
export const contextApi = {
  getAll: () => apiClient.getContexts(),
  getById: (id: string) => apiClient.getContext(id),
  create: (context: AddContextRequest) => apiClient.addContext(context),
  analyze: (id: string) => apiClient.analyzeContext(id),
  getStats: () => apiClient.getContextStats(),
};

export const insightsApi = {
  getAll: (params?: Parameters<typeof apiClient.getInsights>[0]) => apiClient.getInsights(params),
  getById: (id: string) => apiClient.getInsight(id),
  generate: (contextIds: string[], options?: Parameters<typeof apiClient.generateInsights>[1]) => 
    apiClient.generateInsights(contextIds, options),
  getTop: (limit?: number) => apiClient.getTopInsights(limit),
};

export const connectionsApi = {
  getAll: () => apiClient.getAllConnections(),
  getForContext: (contextId: string) => apiClient.getConnectionsForContext(contextId),
};

// Mock data for development when API is not available
export const mockData = {
  contexts: [
    {
      id: '1',
      title: 'Pulse AI Research Notes',
      content: 'Researching AI-powered context management systems for cross-platform integration. Key focus areas: memory persistence, semantic search, and intelligent insights generation.',
      source: 'windows' as const,
      platform: 'Windows 11',
      application: 'Notepad++',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      tags: ['research', 'ai', 'pulse-ai', 'notes']
    },
    {
      id: '2',
      title: 'Context Bridge Architecture',
      content: 'Designing a TypeScript/Node.js backend with React frontend for context management. Using Express.js for API, WebSocket for real-time updates.',
      source: 'web' as const,
      platform: 'Chrome',
      url: 'https://github.com/pulse-ai/context-bridge',
      timestamp: new Date('2024-01-15T11:15:00Z'),
      tags: ['architecture', 'typescript', 'react', 'nodejs']
    },
    {
      id: '3',
      title: 'Meeting with Product Team',
      content: 'Discussed requirements for Context Bridge feature. Need to support Windows, macOS, and web platforms with AI-powered insights.',
      source: 'macos' as const,
      platform: 'macOS Sonoma',
      application: 'Notes.app',
      timestamp: new Date('2024-01-15T14:00:00Z'),
      tags: ['meeting', 'product', 'requirements']
    },
  ] as Context[],
  
  insights: [
    {
      id: '1',
      title: 'Cross-Platform Development Pattern',
      description: 'Multiple contexts show focus on cross-platform compatibility, suggesting a systematic approach to multi-OS development.',
      type: 'pattern' as const,
      confidence: 0.92,
      relatedContexts: ['1', '2', '3'],
      timestamp: new Date('2024-01-15T17:00:00Z')
    },
    {
      id: '2',
      title: 'AI-First Architecture Trend',
      description: 'Recent contexts indicate a strong emphasis on AI integration and intelligent automation features.',
      type: 'trend' as const,
      confidence: 0.88,
      relatedContexts: ['1', '4'],
      timestamp: new Date('2024-01-15T17:15:00Z')
    }
  ] as Insight[],
  
  connections: [
    {
      id: '1',
      sourceId: '1',
      targetId: '2',
      type: 'semantic' as const,
      strength: 0.85,
      description: 'Both contexts discuss AI research and architecture',
      timestamp: new Date('2024-01-15T17:30:00Z')
    }
  ] as Connection[]
};