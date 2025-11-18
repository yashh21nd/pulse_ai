import { Context, Insight, Connection } from '../types';

export class InsightGenerator {
  private insights: Insight[] = [];
  private connections: Connection[] = [];

  constructor() {
    this.initializeSampleInsights();
  }

  private initializeSampleInsights() {
    this.insights = [
      {
        id: 'insight-1',
        title: 'Cross-Platform Development Focus',
        description: 'Analysis shows consistent focus on cross-platform compatibility across Windows, macOS, and web environments. This suggests a strategic approach to universal accessibility.',
        type: 'pattern',
        confidence: 0.94,
        relatedContexts: ['1', '2', '3'],
        timestamp: new Date('2024-01-15T17:00:00Z'),
        metadata: {
          platforms: ['windows', 'macos', 'web'],
          frequency: 8,
          timespan: '3 days'
        }
      },
      {
        id: 'insight-2',
        title: 'AI Integration Acceleration',
        description: 'Recent activity shows increased research and implementation of AI-powered features, particularly in context analysis and intelligent automation.',
        type: 'trend',
        confidence: 0.89,
        relatedContexts: ['1', '4'],
        timestamp: new Date('2024-01-15T17:15:00Z'),
        metadata: {
          trendDirection: 'increasing',
          velocity: 'high',
          technologies: ['openai', 'nlp', 'semantic-search']
        }
      },
      {
        id: 'insight-3',
        title: 'TypeScript Architecture Preference',
        description: 'Strong preference for TypeScript-based architecture across both frontend and backend development, indicating focus on type safety and maintainability.',
        type: 'pattern',
        confidence: 0.87,
        relatedContexts: ['2', '4'],
        timestamp: new Date('2024-01-15T17:30:00Z'),
        metadata: {
          technologies: ['typescript', 'nodejs', 'react'],
          codeQuality: 'high',
          maintainability: 'excellent'
        }
      },
      {
        id: 'insight-4',
        title: 'Collaborative Development Workflow',
        description: 'Multiple contexts indicate structured collaboration between product and engineering teams, with clear documentation and requirement gathering processes.',
        type: 'connection',
        confidence: 0.82,
        relatedContexts: ['2', '3'],
        timestamp: new Date('2024-01-15T17:45:00Z'),
        metadata: {
          collaborationScore: 0.9,
          processMaturity: 'high',
          communicationChannels: ['meetings', 'documentation', 'code-review']
        }
      },
      {
        id: 'insight-5',
        title: 'API-First Development Strategy',
        description: 'Consistent emphasis on API design and integration suggests an API-first development approach, enabling better modularity and third-party integrations.',
        type: 'recommendation',
        confidence: 0.85,
        relatedContexts: ['2', '4'],
        timestamp: new Date('2024-01-15T18:00:00Z'),
        metadata: {
          strategy: 'api-first',
          benefits: ['modularity', 'scalability', 'integration'],
          implementationComplexity: 'medium'
        }
      }
    ];

    this.connections = [
      {
        id: 'conn-1-4',
        sourceId: '1',
        targetId: '4',
        type: 'semantic',
        strength: 0.92,
        description: 'Strong semantic relationship: Both contexts focus on AI research and implementation strategies',
        timestamp: new Date('2024-01-15T17:30:00Z')
      },
      {
        id: 'conn-2-3',
        sourceId: '2',
        targetId: '3',
        type: 'temporal',
        strength: 0.78,
        description: 'Temporal relationship: Architecture planning follows product requirements gathering',
        timestamp: new Date('2024-01-15T17:45:00Z')
      },
      {
        id: 'conn-1-2',
        sourceId: '1',
        targetId: '2',
        type: 'source',
        strength: 0.85,
        description: 'Source relationship: Research notes inform architectural decisions',
        timestamp: new Date('2024-01-15T18:00:00Z')
      }
    ];
  }

  generateInsights(contextIds: string[], options: {
    type?: 'pattern' | 'connection' | 'trend' | 'recommendation';
    minConfidence?: number;
  } = {}): Insight[] {
    const { type, minConfidence = 0.7 } = options;
    
    let relevantInsights = this.insights.filter(insight => {
      // Check if insight relates to any of the specified contexts
      const hasRelevantContext = insight.relatedContexts.some(id => 
        contextIds.includes(id)
      );
      
      // Check type filter
      const matchesType = !type || insight.type === type;
      
      // Check confidence threshold
      const meetsConfidence = insight.confidence >= minConfidence;
      
      return hasRelevantContext && matchesType && meetsConfidence;
    });

    // Generate additional insights based on context analysis
    if (contextIds.length > 1) {
      const crossContextInsights = this.generateCrossContextInsights(contextIds);
      relevantInsights = [...relevantInsights, ...crossContextInsights];
    }

    return relevantInsights.sort((a, b) => b.confidence - a.confidence);
  }

  private generateCrossContextInsights(contextIds: string[]): Insight[] {
    const insights: Insight[] = [];
    
    // Generate pattern insights for multiple contexts
    if (contextIds.length >= 3) {
      insights.push({
        id: `gen-pattern-${Date.now()}`,
        title: 'Multi-Context Pattern Detected',
        description: `Analysis of ${contextIds.length} related contexts reveals a consistent pattern of work focused on integrated development approach.`,
        type: 'pattern',
        confidence: Math.min(0.9, 0.6 + (contextIds.length * 0.05)),
        relatedContexts: contextIds,
        timestamp: new Date(),
        metadata: {
          contextCount: contextIds.length,
          patternStrength: 'strong',
          analysisType: 'multi-context'
        }
      });
    }
    
    // Generate recommendation based on context clustering
    insights.push({
      id: `gen-rec-${Date.now()}`,
      title: 'Context Organization Recommendation',
      description: 'Consider creating a project workspace to better organize these related contexts and enable more efficient cross-referencing.',
      type: 'recommendation',
      confidence: 0.75,
      relatedContexts: contextIds,
      timestamp: new Date(),
      metadata: {
        actionType: 'organization',
        priority: 'medium',
        estimatedEffort: 'low'
      }
    });
    
    return insights;
  }

  getInsightsByType(type: 'pattern' | 'connection' | 'trend' | 'recommendation'): Insight[] {
    return this.insights.filter(insight => insight.type === type);
  }

  getInsightsByConfidence(minConfidence: number): Insight[] {
    return this.insights
      .filter(insight => insight.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  }

  getTopInsights(limit: number = 5): Insight[] {
    return this.insights
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  addInsight(insight: Omit<Insight, 'id' | 'timestamp'>): Insight {
    const newInsight: Insight = {
      ...insight,
      id: `insight-${Date.now()}`,
      timestamp: new Date()
    };
    
    this.insights.push(newInsight);
    return newInsight;
  }

  getConnections(): Connection[] {
    return [...this.connections];
  }

  getConnectionsByContext(contextId: string): Connection[] {
    return this.connections.filter(conn => 
      conn.sourceId === contextId || conn.targetId === contextId
    );
  }

  generateContextConnections(contexts: string[]): Connection[] {
    const connections: Connection[] = [];
    
    // Generate connections between all pairs of contexts
    for (let i = 0; i < contexts.length; i++) {
      for (let j = i + 1; j < contexts.length; j++) {
        const sourceId = contexts[i];
        const targetId = contexts[j];
        
        // Check if connection already exists
        const existingConnection = this.connections.find(conn =>
          (conn.sourceId === sourceId && conn.targetId === targetId) ||
          (conn.sourceId === targetId && conn.targetId === sourceId)
        );
        
        if (!existingConnection) {
          connections.push({
            id: `gen-conn-${sourceId}-${targetId}`,
            sourceId,
            targetId,
            type: 'semantic',
            strength: Math.random() * 0.4 + 0.5, // Random strength between 0.5-0.9
            description: 'Generated semantic connection based on context analysis',
            timestamp: new Date()
          });
        }
      }
    }
    
    return connections;
  }

  getAllInsights(): Insight[] {
    return [...this.insights];
  }

  getInsight(id: string): Insight | undefined {
    return this.insights.find(i => i.id === id);
  }
}