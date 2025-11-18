import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Context as ContextItem, Insight, Connection as ContextConnection } from './types';
import { ContextList } from './components/ContextList-fixed';
import { InsightsList } from './components/InsightsList-optimized';
import { ConnectionsList } from './components/ConnectionsList-fixed';
import { AddContextForm } from './components/AddContextForm';
import { api } from './services/api-optimized';
import './index.css';

function App() {
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [connections, setConnections] = useState<ContextConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load context items
      const contextResponse = await api.getContextItems();
      setContextItems(contextResponse);

      // Load insights
      const insightsResponse = await api.getInsights();
      setInsights(insightsResponse.insights);

      // Analyze connections for existing items
      if (contextResponse.length > 1) {
        const analysisResponse = await api.analyzeConnections();
        setConnections(analysisResponse.connections);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleAddContext = useCallback(async (newContext: Omit<ContextItem, 'id' | 'timestamp'>) => {
    try {
      const addedContext = await api.addContextItem(newContext);
      setContextItems(prev => [addedContext, ...prev]);
      
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
    const actionableInsights = insights.filter(i => i.actionable).length;
    return {
      contextCount: contextItems.length,
      connectionsCount: connections.length,
      insightsCount: insights.length,
      actionableCount: actionableInsights
    };
  }, [contextItems.length, connections.length, insights.length, insights]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>🧠 Analyzing your context...</h2>
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
        <AddContextForm onAddContext={handleAddContext} />
      </div>

      <div className="dashboard">
        <div className="card">
          <h3>🧠 AI Insights</h3>
          <InsightsList insights={insights} />
        </div>
        
        <div className="card">
          <h3>🔗 Context Connections</h3>
          <ConnectionsList connections={connections} contextItems={contextItems} />
        </div>
      </div>

      <div className="card">
        <h3>📚 Recent Context Items</h3>
        <ContextList items={contextItems} />
      </div>
    </div>
  );
}

export default React.memo(App);