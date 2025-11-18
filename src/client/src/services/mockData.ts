import { Context as ContextItem, Insight, Connection as ContextConnection } from '../types';

// Mock data for development/fallback purposes
export const mockContextItems: ContextItem[] = [
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
  }
];

export const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    title: 'Cross-Platform Development Focus',
    description: 'Analysis shows consistent focus on cross-platform compatibility across Windows, macOS, and web environments.',
    type: 'pattern' as const,
    confidence: 0.94,
    relatedContexts: ['1', '2', '3'],
    timestamp: new Date('2024-01-15T17:00:00Z')
  },
  {
    id: 'insight-2', 
    title: 'AI Integration Acceleration',
    description: 'Recent activity shows increased research and implementation of AI-powered features.',
    type: 'trend' as const,
    confidence: 0.89,
    relatedContexts: ['1'],
    timestamp: new Date('2024-01-15T17:15:00Z')
  }
];

export const mockConnections: ContextConnection[] = [
  {
    id: 'conn-1-2',
    sourceId: '1',
    targetId: '2', 
    type: 'semantic' as const,
    strength: 0.92,
    description: 'Both contexts focus on AI research and architecture planning',
    timestamp: new Date('2024-01-15T17:30:00Z')
  },
  {
    id: 'conn-2-3',
    sourceId: '2',
    targetId: '3',
    type: 'temporal' as const,
    strength: 0.78,
    description: 'Architecture planning follows product requirements meeting',
    timestamp: new Date('2024-01-15T17:45:00Z')
  }
];