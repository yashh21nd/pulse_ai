import React, { useState, useEffect } from 'react';
import { Insight } from '../types';
import { insightsApi, mockData } from '../services/api';

interface InsightsListProps {
  contextIds?: string[];
  type?: 'pattern' | 'connection' | 'trend' | 'recommendation';
  limit?: number;
}

export const InsightsList: React.FC<InsightsListProps> = ({ 
  contextIds, 
  type, 
  limit 
}) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [contextIds, type, limit]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (contextIds && contextIds.length > 0) {
        // Generate insights for specific contexts
        response = await insightsApi.generate(contextIds, { type });
      } else if (limit) {
        // Get top insights with limit
        response = await insightsApi.getTop(limit);
      } else {
        // Get all insights with optional type filter
        response = await insightsApi.getAll({ type });
      }
      
      if (response.success && response.data) {
        setInsights(response.data);
      } else {
        // Use mock data as fallback
        let fallbackInsights = mockData.insights;
        if (type) {
          fallbackInsights = fallbackInsights.filter(insight => insight.type === type);
        }
        if (limit) {
          fallbackInsights = fallbackInsights.slice(0, limit);
        }
        setInsights(fallbackInsights);
      }
    } catch (err) {
      console.error('Failed to load insights:', err);
      setError('Failed to load insights');
      // Use mock data as fallback
      setInsights(mockData.insights);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (insightType: string) => {
    switch (insightType) {
      case 'pattern':
        return '🔍';
      case 'connection':
        return '🔗';
      case 'trend':
        return '📈';
      case 'recommendation':
        return '💡';
      default:
        return '🧠';
    }
  };

  const getTypeColor = (insightType: string) => {
    switch (insightType) {
      case 'pattern':
        return '#667eea';
      case 'connection':
        return '#f093fb';
      case 'trend':
        return '#4ecdc4';
      case 'recommendation':
        return '#45b7d1';
      default:
        return '#6c757d';
    }
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
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
            <span className="section-icon">🧠</span>
            AI Insights
            {type && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}> ({type})</span>}
          </h2>
        </div>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && insights.length === 0) {
    return (
      <div className="section-card">
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-icon">🧠</span>
            AI Insights
          </h2>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3 className="empty-state-title">Error Loading Insights</h3>
          <p className="empty-state-text">{error}</p>
          <button className="btn" onClick={loadInsights}>
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
          <span className="section-icon">🧠</span>
          AI Insights
          {type && <span style={{ fontSize: '0.9rem', opacity: 0.7 }}> ({type})</span>}
        </h2>
        <button className="btn" onClick={loadInsights}>
          Refresh
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No Insights Available</h3>
          <p className="empty-state-text">
            {contextIds && contextIds.length > 0
              ? 'No insights found for the selected contexts. Try adding more context or adjusting filters.'
              : 'Add more contexts to generate meaningful insights and discover patterns in your data.'
            }
          </p>
        </div>
      ) : (
        <div className="item-list">
          {insights.map((insight) => (
            <div key={insight.id} className="list-item insight-item">
              <div className="item-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span 
                    className="type-icon"
                    style={{ 
                      fontSize: '1.5rem',
                      color: getTypeColor(insight.type)
                    }}
                  >
                    {getTypeIcon(insight.type)}
                  </span>
                  <h3 className="item-title" style={{ margin: 0 }}>
                    {insight.title}
                  </h3>
                </div>
                <div className="item-meta">
                  <span 
                    className="insight-type"
                    style={{ 
                      backgroundColor: getTypeColor(insight.type),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}
                  >
                    {insight.type}
                  </span>
                  <span className="confidence-score">
                    {formatConfidence(insight.confidence)} confidence
                  </span>
                  <span className="timestamp">
                    🕒 {formatTimestamp(insight.timestamp)}
                  </span>
                </div>
              </div>

              <div className="item-content">
                {insight.description}
              </div>

              {insight.relatedContexts && insight.relatedContexts.length > 0 && (
                <div className="related-contexts">
                  <span className="related-label">
                    🔗 Related to {insight.relatedContexts.length} context{insight.relatedContexts.length > 1 ? 's' : ''}
                  </span>
                  <div className="context-ids">
                    {insight.relatedContexts.slice(0, 3).map((contextId, index) => (
                      <span key={contextId} className="context-id">
                        #{contextId}
                        {index < Math.min(2, insight.relatedContexts.length - 1) && ', '}
                      </span>
                    ))}
                    {insight.relatedContexts.length > 3 && (
                      <span className="more-contexts">
                        +{insight.relatedContexts.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {insight.metadata && (
                <div className="insight-metadata">
                  {Object.entries(insight.metadata).slice(0, 3).map(([key, value]) => (
                    <span key={key} className="metadata-item">
                      <strong>{key}:</strong> {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {error && insights.length > 0 && (
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
        .related-contexts {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .related-label {
          display: block;
          font-weight: 600;
          color: #667eea;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        
        .context-ids {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .context-id {
          background: #667eea;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .more-contexts {
          color: #666;
          font-style: italic;
          font-size: 0.8rem;
        }
        
        .insight-metadata {
          margin-top: 0.75rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .metadata-item {
          font-size: 0.8rem;
          color: #666;
          padding: 0.25rem 0.75rem;
          background: #f8f9fa;
          border-radius: 16px;
        }
        
        .metadata-item strong {
          color: #333;
        }
      `}</style>
    </div>
  );
};