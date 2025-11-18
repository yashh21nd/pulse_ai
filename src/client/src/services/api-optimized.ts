import axios from 'axios';
import { Context as ContextItem, Insight, Connection as ContextConnection } from '../types';
import { mockContextItems, mockInsights, mockConnections } from './mockData';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000, // Reduced timeout for faster fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to simulate API delay for development
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Context Items
  async getContextItems(): Promise<ContextItem[]> {
    try {
      const response = await apiClient.get('/context');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for context items');
      await delay();
      return mockContextItems;
    }
  },

  async addContextItem(context: Omit<ContextItem, 'id' | 'timestamp'>): Promise<ContextItem> {
    try {
      const response = await apiClient.post('/context', context);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, simulating context addition');
      await delay();
      const newContext: ContextItem = {
        ...context,
        id: `ctx-${Date.now()}`,
        timestamp: new Date(),
      };
      // In a real app, you'd persist this somewhere
      mockContextItems.unshift(newContext);
      return newContext;
    }
  },

  async getContextItem(id: string): Promise<ContextItem> {
    try {
      const response = await apiClient.get(`/context/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for context item');
      await delay();
      const item = mockContextItems.find(c => c.id === id);
      if (!item) throw new Error(`Context item ${id} not found`);
      return item;
    }
  },

  // Insights
  async getInsights(): Promise<{ insights: Insight[] }> {
    try {
      const response = await apiClient.get('/insights');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for insights');
      await delay();
      return { insights: mockInsights };
    }
  },

  async generateInsights(contextIds?: string[]): Promise<{ insights: Insight[] }> {
    try {
      const response = await apiClient.post('/insights/generate', { contextIds });
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for insights generation');
      await delay(500); // Simulate longer processing time
      return { insights: mockInsights };
    }
  },

  // Connections
  async analyzeConnections(): Promise<{ connections: ContextConnection[] }> {
    try {
      const response = await apiClient.get('/insights/connections');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for connections');
      await delay();
      return { connections: mockConnections };
    }
  },

  async getConnections(): Promise<{ connections: ContextConnection[] }> {
    try {
      const response = await apiClient.get('/insights/connections');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, using mock data for connections');
      await delay();
      return { connections: mockConnections };
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.warn('API unavailable, simulating health check');
      await delay();
      return { 
        status: 'Context Bridge API is running (mock mode)', 
        timestamp: new Date().toISOString() 
      };
    }
  },
};

export default api;