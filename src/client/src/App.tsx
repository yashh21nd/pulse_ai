import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Context as ContextItem, Insight, Connection as ContextConnection } from './types';
import { ContextList } from './components/ContextList';
import { InsightsList } from './components/InsightsList';
import { ConnectionsList } from './components/ConnectionsList';
import { AddContextForm } from './components/AddContextForm';
import { contextApi, insightsApi } from './services/api';
import './index.css';

function App() {
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [connections, setConnections] = useState<ContextConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('🎯 App component rendering...');

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load context items
      const contextResponse = await contextApi.getAll();
      if (contextResponse.success && contextResponse.data) {
        setContextItems(contextResponse.data);
      } else {
        console.warn('API failed, using mock data:', contextResponse.error);
        // Import mock data dynamically
        const { mockData } = await import('./services/api');
        setContextItems(mockData.contexts);
        setInsights(mockData.insights);
        setConnections(mockData.connections);
        setLoading(false);
        return;
      }

      // Load insights
      const insightsResponse = await insightsApi.getAll();
      if (insightsResponse.success && insightsResponse.data) {
        setInsights(insightsResponse.data);
      } else {
        console.warn('Insights API failed, using mock data');
        const { mockData } = await import('./services/api');
        setInsights(mockData.insights);
      }

      // Load connections
      if (contextResponse.success && contextResponse.data && contextResponse.data.length > 1) {
        // For now, use empty connections as the component manages its own data
        setConnections([]);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      console.log('Falling back to mock data');
      // Fallback to mock data
      const { mockData } = await import('./services/api');
      setContextItems(mockData.contexts);
      setInsights(mockData.insights);
      setConnections(mockData.connections);
      setError('Using demo data - API connection failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAddContext = useCallback(async (newContext: Omit<ContextItem, 'id' | 'timestamp'>) => {
    try {
      const addedContext = await contextApi.create(newContext);
      if (addedContext.success && addedContext.data) {
        setContextItems(prev => [addedContext.data!, ...prev]);
      }
      
      // Trigger new analysis with debouncing
      setTimeout(() => {
        loadInitialData();
      }, 500);
    } catch (err) {
      console.error('Error adding context:', err);
      setError('Failed to add context item. Please try again.');
    }
  }, [loadInitialData]);

  // Memoize computed values
  const stats = useMemo(() => {
    const actionableInsights = insights.filter(i => i.type === 'recommendation').length;
    return {
      contextCount: contextItems.length,
      connectionsCount: connections.length,
      insightsCount: insights.length,
      actionableCount: actionableInsights
    };
  }, [contextItems.length, connections.length, insights.length, insights]);

  if (loading) {
    console.log('📊 App in loading state');
    return (
      <div className="container" style={{padding: '40px', textAlign: 'center'}}>
        <div className="loading">
          <h2>🧠 Analyzing your context...</h2>
          <p>Loading Context Bridge application...</p>
          <div style={{marginTop: '20px', fontSize: '0.9em', color: '#666'}}>
            <p>✅ React component loaded</p>
            <p>🔄 Fetching data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Memoize the stat cards to prevent unnecessary re-renders
  const StatCards = useMemo(() => (
    <div className="stats">
      <div className="stat-card">
        <div className="stat-number">{stats.contextCount}</div>
        <div className="stat-label">Context Items</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.connectionsCount}</div>
        <div className="stat-label">Connections Found</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.insightsCount}</div>
        <div className="stat-label">AI Insights</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.actionableCount}</div>
        <div className="stat-label">Actionable Items</div>
      </div>
    </div>
  ), [stats]);

  return (
    <div className="container">
      <header className="header">
        <h1>🔗 Context Bridge</h1>
        <p>AI-Powered Cross-Platform Memory Integration for Pulse AI COO</p>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {StatCards}

      <div className="demo-section">
        <h3>📝 Add New Context</h3>
        <AddContextForm onContextAdded={(success, message) => {
          if (success) {
            console.log(message || 'Context added successfully!');
            loadInitialData();
          } else {
            setError(message || 'Failed to add context.');
          }
        }} />
      </div>

      <div className="dashboard">
        <div className="card">
          <h3>🧠 AI Insights</h3>
          <InsightsList contextIds={contextItems.map(c => c.id)} />
        </div>
        
        <div className="card">
          <h3>🔗 Context Connections</h3>
          <ConnectionsList />
        </div>
      </div>

      <div className="card">
        <h3>📚 Recent Context Items</h3>
        <ContextList />
      </div>
    </div>
  );
}

export default React.memo(App);