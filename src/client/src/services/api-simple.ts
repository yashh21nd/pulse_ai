import axios from 'axios';
import { Context as ContextItem, Insight, Connection as ContextConnection } from '../types';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const api = {
  // Context Items
  async getContextItems(): Promise<ContextItem[]> {
    const response = await apiClient.get('/context');
    return response.data;
  },

  async addContextItem(context: Omit<ContextItem, 'id' | 'timestamp'>): Promise<ContextItem> {
    const response = await apiClient.post('/context', context);
    return response.data;
  },

  async getContextItem(id: string): Promise<ContextItem> {
    const response = await apiClient.get(`/context/${id}`);
    return response.data;
  },

  // Insights
  async getInsights(): Promise<{ insights: Insight[] }> {
    const response = await apiClient.get('/insights');
    return response.data;
  },

  async generateInsights(contextIds?: string[]): Promise<{ insights: Insight[] }> {
    const response = await apiClient.post('/insights/generate', { contextIds });
    return response.data;
  },

  // Connections
  async analyzeConnections(): Promise<{ connections: ContextConnection[] }> {
    const response = await apiClient.get('/insights/connections');
    return response.data;
  },

  async getConnections(): Promise<{ connections: ContextConnection[] }> {
    const response = await apiClient.get('/insights/connections');
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default api;