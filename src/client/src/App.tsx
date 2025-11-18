import React, { useState, useEffect } from 'react';
import { Context as ContextItem, Insight, Connection as ContextConnection } from './types';
import { ContextList } from './components/ContextList';
import { InsightsList } from './components/InsightsList';
import { ConnectionsList } from './components/ConnectionsList';
import { AddContextForm } from './components/AddContextForm';
// Using mock data for demo
import './index.css';

function App() {
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [connections, setConnections] = useState<ContextConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  console.log('🎯 App component rendering...');

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always use mock data for now to avoid API issues
      console.log('Loading mock data for demo...');
      const { mockData } = await import('./services/api');
      setContextItems(mockData.contexts);
      setInsights(mockData.insights);
      setConnections(mockData.connections);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAddContext = async (newContext: Omit<ContextItem, 'id' | 'timestamp'>) => {
    try {
      console.log('Adding new context:', newContext);
      // For demo, just add to local state
      const newItem = {
        ...newContext,
        id: Date.now().toString(),
        timestamp: new Date()
      };
      setContextItems(prev => [newItem, ...prev]);
    } catch (err) {
      console.error('Error adding context:', err);
      setError('Failed to add context item. Please try again.');
    }
  };

  // Simple computed values
  const actionableInsights = insights.filter(i => i.type === 'recommendation').length;
  const stats = {
    contextCount: contextItems.length,
    connectionsCount: connections.length,
    insightsCount: insights.length,
    actionableCount: actionableInsights
  };

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

  // Simple stat cards component
  const StatCards = (
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
  );

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

export default App;