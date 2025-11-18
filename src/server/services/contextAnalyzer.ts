import { Context, Insight, Connection, AnalysisResult } from '../types';

export class ContextAnalyzer {
  private contexts: Context[] = [];
  private insights: Insight[] = [];
  private connections: Connection[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample contexts
    this.contexts = [
      {
        id: '1',
        title: 'Pulse AI Research Notes',
        content: 'Researching AI-powered context management systems for cross-platform integration. Key focus areas: memory persistence, semantic search, and intelligent insights generation.',
        source: 'windows',
        platform: 'Windows 11',
        application: 'Notepad++',
        timestamp: new Date('2024-01-15T10:30:00Z'),
        tags: ['research', 'ai', 'pulse-ai', 'notes']
      },
      {
        id: '2',
        title: 'Context Bridge Architecture',
        content: 'Designing a TypeScript/Node.js backend with React frontend for context management. Using Express.js for API, WebSocket for real-time updates.',
        source: 'web',
        platform: 'Chrome',
        url: 'https://github.com/pulse-ai/context-bridge',
        timestamp: new Date('2024-01-15T11:15:00Z'),
        tags: ['architecture', 'typescript', 'react', 'nodejs']
      },
      {
        id: '3',
        title: 'Meeting with Product Team',
        content: 'Discussed requirements for Context Bridge feature. Need to support Windows, macOS, and web platforms with AI-powered insights.',
        source: 'macos',
        platform: 'macOS Sonoma',
        application: 'Notes.app',
        timestamp: new Date('2024-01-15T14:00:00Z'),
        tags: ['meeting', 'product', 'requirements']
      },
      {
        id: '4',
        title: 'AI Integration Research',
        content: 'Exploring OpenAI API integration for generating contextual insights. Focus on semantic similarity, pattern recognition, and automated tagging.',
        source: 'web',
        platform: 'Safari',
        url: 'https://platform.openai.com/docs',
        timestamp: new Date('2024-01-15T16:30:00Z'),
        tags: ['ai', 'openai', 'integration', 'api']
      }
    ];

    // Sample insights
    this.insights = [
      {
        id: '1',
        title: 'Cross-Platform Development Pattern',
        description: 'Multiple contexts show focus on cross-platform compatibility, suggesting a systematic approach to multi-OS development.',
        type: 'pattern',
        confidence: 0.92,
        relatedContexts: ['1', '2', '3'],
        timestamp: new Date('2024-01-15T17:00:00Z')
      },
      {
        id: '2',
        title: 'AI-First Architecture Trend',
        description: 'Recent contexts indicate a strong emphasis on AI integration and intelligent automation features.',
        type: 'trend',
        confidence: 0.88,
        relatedContexts: ['1', '4'],
        timestamp: new Date('2024-01-15T17:15:00Z')
      }
    ];

    // Sample connections
    this.connections = [
      {
        id: '1',
        sourceId: '1',
        targetId: '4',
        type: 'semantic',
        strength: 0.85,
        description: 'Both contexts discuss AI research and integration',
        timestamp: new Date('2024-01-15T17:30:00Z')
      },
      {
        id: '2',
        sourceId: '2',
        targetId: '3',
        type: 'temporal',
        strength: 0.7,
        description: 'Architecture discussion follows product meeting',
        timestamp: new Date('2024-01-15T17:45:00Z')
      }
    ];
  }

  analyzeContext(contextId: string): AnalysisResult {
    const context = this.contexts.find(c => c.id === contextId);
    if (!context) {
      throw new Error(`Context with id ${contextId} not found`);
    }

    // Simulate AI analysis
    const relatedContexts = this.findRelatedContexts(context);
    const newInsights = this.generateInsights(context, relatedContexts);
    const newConnections = this.findConnections(context, relatedContexts);

    return {
      insights: newInsights,
      connections: newConnections,
      tags: this.extractTags(context.content),
      confidence: 0.85
    };
  }

  private findRelatedContexts(context: Context): Context[] {
    return this.contexts.filter(c => {
      if (c.id === context.id) return false;
      
      // Simple similarity based on tags and content keywords
      const commonTags = context.tags.filter(tag => 
        c.tags.includes(tag)
      );
      
      const contentWords = context.content.toLowerCase().split(/\s+/);
      const otherWords = c.content.toLowerCase().split(/\s+/);
      const commonWords = contentWords.filter(word => 
        word.length > 3 && otherWords.includes(word)
      );

      return commonTags.length > 0 || commonWords.length > 2;
    });
  }

  private generateInsights(context: Context, related: Context[]): Insight[] {
    const insights: Insight[] = [];

    // Pattern detection
    if (related.length > 1) {
      insights.push({
        id: `insight-${Date.now()}-1`,
        title: `Related Work Pattern`,
        description: `This context is part of a larger work pattern involving ${related.length} related items.`,
        type: 'pattern',
        confidence: Math.min(0.9, 0.6 + (related.length * 0.1)),
        relatedContexts: [context.id, ...related.map(r => r.id)],
        timestamp: new Date()
      });
    }

    // Trend analysis
    const recentRelated = related.filter(r => 
      (new Date().getTime() - r.timestamp.getTime()) < 24 * 60 * 60 * 1000
    );
    
    if (recentRelated.length > 0) {
      insights.push({
        id: `insight-${Date.now()}-2`,
        title: `Active Topic Trend`,
        description: `High activity detected around topics: ${context.tags.slice(0, 3).join(', ')}`,
        type: 'trend',
        confidence: 0.75,
        relatedContexts: [context.id, ...recentRelated.map(r => r.id)],
        timestamp: new Date()
      });
    }

    return insights;
  }

  private findConnections(context: Context, related: Context[]): Connection[] {
    return related.map(relatedContext => ({
      id: `conn-${context.id}-${relatedContext.id}`,
      sourceId: context.id,
      targetId: relatedContext.id,
      type: 'semantic' as const,
      strength: this.calculateSimilarity(context, relatedContext),
      description: `Semantic connection based on shared topics`,
      timestamp: new Date()
    }));
  }

  private calculateSimilarity(ctx1: Context, ctx2: Context): number {
    const commonTags = ctx1.tags.filter(tag => ctx2.tags.includes(tag));
    const tagSimilarity = commonTags.length / Math.max(ctx1.tags.length, ctx2.tags.length);
    
    const words1 = ctx1.content.toLowerCase().split(/\s+/);
    const words2 = ctx2.content.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => word.length > 3 && words2.includes(word));
    const contentSimilarity = commonWords.length / Math.max(words1.length, words2.length);
    
    return Math.min(0.95, (tagSimilarity * 0.6 + contentSimilarity * 0.4));
  }

  private extractTags(content: string): string[] {
    const keywords = [
      'ai', 'typescript', 'react', 'nodejs', 'api', 'integration',
      'research', 'development', 'architecture', 'platform', 'system'
    ];
    
    const extractedTags: string[] = [];
    const lowercaseContent = content.toLowerCase();
    
    keywords.forEach(keyword => {
      if (lowercaseContent.includes(keyword)) {
        extractedTags.push(keyword);
      }
    });
    
    return extractedTags;
  }

  getAllContexts(): Context[] {
    return [...this.contexts];
  }

  addContext(context: Omit<Context, 'id' | 'timestamp'>): Context {
    const newContext: Context = {
      ...context,
      id: `ctx-${Date.now()}`,
      timestamp: new Date()
    };
    
    this.contexts.push(newContext);
    return newContext;
  }

  getContext(id: string): Context | undefined {
    return this.contexts.find(c => c.id === id);
  }

  getAllInsights(): Insight[] {
    return [...this.insights];
  }

  getAllConnections(): Connection[] {
    return [...this.connections];
  }
}