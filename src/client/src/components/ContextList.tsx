import React, { useState, useEffect } from 'react';
import { Context } from '../types';
import { contextApi, mockData } from '../services/api';

interface ContextListProps {
  onContextSelect?: (context: Context) => void;
}

export const ContextList: React.FC<ContextListProps> = ({ onContextSelect }) => {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data
      const response = await contextApi.getAll();
      
      if (response.success && response.data) {
        setContexts(response.data);
      } else {
        // Use mock data as fallback
        setContexts(mockData.contexts);
      }
    } catch (err) {
      console.error('Failed to load contexts:', err);
      setError('Failed to load contexts');
      // Use mock data as fallback
      setContexts(mockData.contexts);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (source: string) => {
    switch (source) {
      case 'windows':
        return '🪟';
      case 'macos':
        return '🍎';
      case 'web':
        return '🌐';
      default:
        return '📄';
    }
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
            <span className="section-icon">📋</span>
            Context Items
          </h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && contexts.length === 0) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">📋</span>
            Context Items
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3 className="empty-state-title">Error Loading Contexts</h3>
          <p className="empty-state-text">{error}</p>
          <button className="btn" onClick={loadContexts}>
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
          <span className="section-icon">📋</span>
          Context Items
        </h2>
        <button className="btn" onClick={loadContexts}>
          Refresh
        </button>
      </div>

      {contexts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No Contexts Found</h3>
          <p className="empty-state-text">
            Start by adding your first context item to begin building your knowledge graph.
          </p>
        </div>
      ) : (
        <div className="item-list">
          {contexts.map((context) => (
            <div 
              key={context.id} 
              className={`list-item ${onContextSelect ? 'clickable' : ''}`}
              onClick={() => onContextSelect?.(context)}
              style={{ cursor: onContextSelect ? 'pointer' : 'default' }}
            >
              <div className="item-header">
                <h3 className="item-title">{context.title}</h3>
                <div className="item-meta">
                  <span className={`platform ${context.source}`}>
                    {getPlatformIcon(context.source)} {context.platform}
                  </span>
                  {context.application && (
                    <span className="app-info">
                      📱 {context.application}
                    </span>
                  )}
                  <span className="timestamp">
                    🕒 {formatTimestamp(context.timestamp)}
                  </span>
                </div>
              </div>

              <div className="item-content">
                {context.content.length > 200 
                  ? `${context.content.substring(0, 200)}...` 
                  : context.content
                }
              </div>

              {context.url && (
                <div className="item-url">
                  <span className="url-label">🔗</span>
                  <a 
                    href={context.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: '#667eea', textDecoration: 'none' }}
                  >
                    {context.url.length > 60 
                      ? `${context.url.substring(0, 60)}...` 
                      : context.url
                    }
                  </a>
                </div>
              )}

              {context.tags && context.tags.length > 0 && (
                <div className="item-tags">
                  {context.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && contexts.length > 0 && (
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
    </div>
  );
};