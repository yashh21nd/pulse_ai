import React, { memo } from 'react';
import { Context as ContextItem } from '../types';

interface ContextListProps {
  items: ContextItem[];
}

const ContextList: React.FC<ContextListProps> = memo(({ items }) => {
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

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <h3 className="empty-state-title">No Context Items</h3>
        <p className="empty-state-text">
          Start by adding your first context item to begin building your knowledge graph.
        </p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ContextItemComponent key={item.id} item={item} getPlatformIcon={getPlatformIcon} formatTimestamp={formatTimestamp} />
      ))}
    </div>
  );
});

// Memoized individual context item component
const ContextItemComponent: React.FC<{
  item: ContextItem;
  getPlatformIcon: (source: string) => string;
  formatTimestamp: (timestamp: Date | string) => string;
}> = memo(({ item, getPlatformIcon, formatTimestamp }) => (
  <div className="list-item">
    <div className="item-header">
      <h3 className="item-title">{item.title}</h3>
      <div className="item-meta">
        <span className={`platform ${item.source}`}>
          {getPlatformIcon(item.source)} {item.platform}
        </span>
        {item.application && (
          <span className="app-info">
            📱 {item.application}
          </span>
        )}
        <span className="timestamp">
          🕒 {formatTimestamp(item.timestamp)}
        </span>
      </div>
    </div>

    <div className="item-content">
      {item.content.length > 200 
        ? `${item.content.substring(0, 200)}...` 
        : item.content
      }
    </div>

    {item.url && (
      <div className="item-url">
        <span className="url-label">🔗</span>
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#667eea', textDecoration: 'none' }}
        >
          {item.url.length > 60 
            ? `${item.url.substring(0, 60)}...` 
            : item.url
          }
        </a>
      </div>
    )}

    {item.tags && item.tags.length > 0 && (
      <div className="item-tags">
        {item.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
));

ContextList.displayName = 'ContextList';
ContextItemComponent.displayName = 'ContextItemComponent';

export { ContextList };