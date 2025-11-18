import React, { memo } from 'react';
import { Connection as ContextConnection, Context as ContextItem } from '../types';

interface ConnectionsListProps {
  connections: ContextConnection[];
  contextItems: ContextItem[];
}

const ConnectionsList: React.FC<ConnectionsListProps> = memo(({ connections, contextItems }) => {
  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'semantic':
        return '🧠';
      case 'temporal':
        return '⏰';
      case 'source':
        return '📄';
      default:
        return '🔗';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return '#10b981'; // strong - green
    if (strength >= 0.6) return '#f59e0b'; // medium - yellow
    return '#ef4444'; // weak - red
  };

  const getContextTitle = (id: string) => {
    const context = contextItems.find(c => c.id === id);
    return context ? context.title : `Context ${id}`;
  };

  if (connections.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔗</div>
        <h3 className="empty-state-title">No Connections Found</h3>
        <p className="empty-state-text">
          Add more context items to discover connections and relationships.
        </p>
      </div>
    );
  }

  return (
    <div className="item-list">
      {connections.map((connection) => (
        <ConnectionItem 
          key={connection.id} 
          connection={connection}
          getConnectionIcon={getConnectionIcon}
          getStrengthColor={getStrengthColor}
          getContextTitle={getContextTitle}
        />
      ))}
    </div>
  );
});

// Memoized individual connection item component
const ConnectionItem: React.FC<{
  connection: ContextConnection;
  getConnectionIcon: (type: string) => string;
  getStrengthColor: (strength: number) => string;
  getContextTitle: (id: string) => string;
}> = memo(({ connection, getConnectionIcon, getStrengthColor, getContextTitle }) => (
  <div className="list-item connection-item">
    <div className="item-header">
      <h3 className="item-title">
        {getConnectionIcon(connection.type)} Connection
      </h3>
      <div className="item-meta">
        <span 
          className="strength-badge"
          style={{ 
            backgroundColor: getStrengthColor(connection.strength),
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.8em',
            fontWeight: 'bold'
          }}
        >
          {Math.round(connection.strength * 100)}%
        </span>
        <span className="connection-type">{connection.type}</span>
        {connection.timestamp && (
          <span className="timestamp">
            🕒 {new Date(connection.timestamp).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>

    <div className="connection-details">
      <div className="connection-flow">
        <span className="source-context" title={getContextTitle(connection.sourceId)}>
          📄 {getContextTitle(connection.sourceId).substring(0, 30)}
          {getContextTitle(connection.sourceId).length > 30 ? '...' : ''}
        </span>
        <span className="connection-arrow">→</span>
        <span className="target-context" title={getContextTitle(connection.targetId)}>
          📄 {getContextTitle(connection.targetId).substring(0, 30)}
          {getContextTitle(connection.targetId).length > 30 ? '...' : ''}
        </span>
      </div>
    </div>

    {connection.description && (
      <div className="item-content">
        {connection.description}
      </div>
    )}
  </div>
));

ConnectionsList.displayName = 'ConnectionsList';
ConnectionItem.displayName = 'ConnectionItem';

export { ConnectionsList };