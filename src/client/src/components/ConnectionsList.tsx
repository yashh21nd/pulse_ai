import React, { useState, useEffect } from 'react';
import { Connection, Context } from '../types';
import { connectionsApi, contextApi, mockData } from '../services/api';

interface ConnectionsListProps {
  contextId?: string;
  limit?: number;
}

export const ConnectionsList: React.FC<ConnectionsListProps> = ({ 
  contextId, 
  limit 
}) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [contextId, limit]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load connections
      let connectionsResponse;
      if (contextId) {
        connectionsResponse = await connectionsApi.getForContext(contextId);
      } else {
        connectionsResponse = await connectionsApi.getAll();
      }
      
      let connectionData: Connection[] = [];
      if (connectionsResponse.success && connectionsResponse.data) {
        connectionData = connectionsResponse.data;
      } else {
        // Use mock data as fallback
        connectionData = mockData.connections;
        if (contextId) {
          connectionData = connectionData.filter(conn => 
            conn.sourceId === contextId || conn.targetId === contextId
          );
        }
      }
      
      // Apply limit if specified
      if (limit && connectionData.length > limit) {
        connectionData = connectionData.slice(0, limit);
      }
      
      setConnections(connectionData);
      
      // Load contexts to display connection details
      const contextsResponse = await contextApi.getAll();
      if (contextsResponse.success && contextsResponse.data) {
        setContexts(contextsResponse.data);
      } else {
        setContexts(mockData.contexts);
      }
      
    } catch (err) {
      console.error('Failed to load connections:', err);
      setError('Failed to load connections');
      // Use mock data as fallback
      setConnections(mockData.connections);
      setContexts(mockData.contexts);
    } finally {
      setLoading(false);
    }
  };

  const getContextById = (id: string): Context | undefined => {
    return contexts.find(ctx => ctx.id === id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'semantic':
        return '🔗';
      case 'temporal':
        return '⏰';
      case 'source':
        return '📂';
      case 'user-defined':
        return '👤';
      default:
        return '🔗';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'semantic':
        return '#667eea';
      case 'temporal':
        return '#4ecdc4';
      case 'source':
        return '#45b7d1';
      case 'user-defined':
        return '#f093fb';
      default:
        return '#6c757d';
    }
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 0.8) return 'Strong';
    if (strength >= 0.6) return 'Medium';
    if (strength >= 0.4) return 'Weak';
    return 'Very Weak';
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return '#28a745';
    if (strength >= 0.6) return '#ffc107';
    if (strength >= 0.4) return '#fd7e14';
    return '#dc3545';
  };

  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🔗</span>
            Context Connections
            {contextId && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}> (for #{contextId})</span>}
          </h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && connections.length === 0) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🔗</span>
            Context Connections
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3 className="empty-state-title">Error Loading Connections</h3>
          <p className="empty-state-text">{error}</p>
          <button className="btn" onClick={loadData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">🔗</span>
          Context Connections
          {contextId && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}> (for #{contextId})</span>}
        </h2>
        <button className="btn" onClick={loadData}>
          Refresh
        </button>
      </div>

      {connections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔗</div>
          <h3 className="empty-state-title">No Connections Found</h3>
          <p className="empty-state-text">
            {contextId 
              ? 'No connections found for this context. Add more related contexts to discover connections.'
              : 'No connections between contexts have been discovered yet. Add more contexts to enable connection analysis.'
            }
          </p>
        </div>
      ) : (
        <div className="item-list">
          {connections.map((connection) => {
            const sourceContext = getContextById(connection.sourceId);
            const targetContext = getContextById(connection.targetId);
            
            return (
              <div key={connection.id} className="list-item connection-item">
                <div className="item-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span 
                      className="type-icon"
                      style={{ 
                        fontSize: '1.5rem',
                        color: getTypeColor(connection.type)
                      }}
                    >
                      {getTypeIcon(connection.type)}
                    </span>
                    <h3 className="item-title" style={{ margin: 0 }}>
                      Connection #{connection.id.slice(-6)}
                    </h3>
                  </div>
                  <div className="item-meta">
                    <span 
                      className="connection-type"
                      style={{ 
                        backgroundColor: getTypeColor(connection.type),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        textTransform: 'capitalize'
                      }}
                    >
                      {connection.type}
                    </span>
                    <span 
                      className="connection-strength"
                      style={{ 
                        color: getStrengthColor(connection.strength),
                        fontWeight: '600',
                        fontSize: '0.8rem'
                      }}
                    >
                      {getStrengthLabel(connection.strength)} ({Math.round(connection.strength * 100)}%)
                    </span>
                    <span className="timestamp">
                      🕒 {formatTimestamp(connection.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="item-content">
                  {connection.description}
                </div>

                <div className="connection-details">
                  <div className="context-pair">
                    <div className="source-context">
                      <div className="context-header">
                        <span className="direction-icon">📤</span>
                        <span className="context-label">Source Context</span>
                      </div>
                      <div className="context-info">
                        <strong>#{connection.sourceId}</strong>
                        {sourceContext && (
                          <span className="context-title">: {sourceContext.title}</span>
                        )}
                      </div>
                    </div>

                    <div className="connection-arrow">
                      <div 
                        className="arrow"
                        style={{
                          width: '40px',
                          height: '2px',
                          backgroundColor: getTypeColor(connection.type),
                          position: 'relative',
                          margin: '0 1rem'
                        }}
                      >
                        <div 
                          style={{
                            position: 'absolute',
                            right: '-6px',
                            top: '-4px',
                            width: '0',
                            height: '0',
                            borderLeft: `6px solid ${getTypeColor(connection.type)}`,
                            borderTop: '5px solid transparent',
                            borderBottom: '5px solid transparent'
                          }}
                        />
                      </div>
                    </div>

                    <div className="target-context">
                      <div className="context-header">
                        <span className="direction-icon">📥</span>
                        <span className="context-label">Target Context</span>
                      </div>
                      <div className="context-info">
                        <strong>#{connection.targetId}</strong>
                        {targetContext && (
                          <span className="context-title">: {targetContext.title}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && connections.length > 0 && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#856404'
        }}>
          ⚠️ {error} (showing cached data)
        </div>
      )}

      <style>{`
        .connection-details {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .context-pair {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        
        @media (max-width: 768px) {
          .context-pair {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .connection-arrow {
            transform: rotate(90deg);
          }
        }
        
        .source-context, .target-context {
          flex: 1;
          min-width: 0;
        }
        
        .context-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        
        .context-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .context-info {
          color: white;
        }
        
        .context-title {
          font-weight: normal;
          opacity: 0.9;
        }
        
        .direction-icon {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};