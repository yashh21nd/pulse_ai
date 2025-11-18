import React, { useState } from 'react';
import { AddContextRequest } from '../types';
import { contextApi } from '../services/api';

interface AddContextFormProps {
  onContextAdded?: (success: boolean, message: string) => void;
  onCancel?: () => void;
}

export const AddContextForm: React.FC<AddContextFormProps> = ({ 
  onContextAdded, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<AddContextRequest>({
    title: '',
    content: '',
    source: 'web',
    platform: '',
    application: '',
    url: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Title is required';
    }
    if (!formData.content.trim()) {
      return 'Content is required';
    }
    if (!formData.platform.trim()) {
      return 'Platform is required';
    }
    if (formData.source === 'web' && formData.url && !isValidUrl(formData.url)) {
      return 'Please enter a valid URL';
    }
    return null;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Clean up form data
      const contextData: AddContextRequest = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        platform: formData.platform.trim(),
        application: formData.application?.trim() || undefined,
        url: formData.url?.trim() || undefined,
        tags: formData.tags.filter(tag => tag.trim().length > 0)
      };
      
      const response = await contextApi.create(contextData);
      
      if (response.success) {
        onContextAdded?.(true, 'Context added successfully!');
        // Reset form
        setFormData({
          title: '',
          content: '',
          source: 'web',
          platform: '',
          application: '',
          url: '',
          tags: []
        });
        setTagInput('');
      } else {
        const errorMessage = response.error || 'Failed to add context';
        setError(errorMessage);
        onContextAdded?.(false, errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      onContextAdded?.(false, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformSuggestions = (source: string) => {
    switch (source) {
      case 'windows':
        return ['Windows 11', 'Windows 10', 'Windows Server'];
      case 'macos':
        return ['macOS Sonoma', 'macOS Ventura', 'macOS Monterey'];
      case 'web':
        return ['Chrome', 'Firefox', 'Safari', 'Edge'];
      default:
        return [];
    }
  };

  const getApplicationSuggestions = (source: string) => {
    switch (source) {
      case 'windows':
        return ['Notepad++', 'Visual Studio Code', 'Microsoft Word', 'Excel', 'PowerPoint'];
      case 'macos':
        return ['Notes.app', 'TextEdit', 'Xcode', 'Pages', 'Keynote'];
      case 'web':
        return ['Gmail', 'Google Docs', 'Slack', 'Notion', 'GitHub'];
      default:
        return [];
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-icon">➕</span>
          Add New Context
        </h2>
        {onCancel && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="error-message" style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            ❌ {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter a descriptive title for this context"
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Enter the context content, notes, or description"
            required
            disabled={loading}
            rows={4}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="source">
              Source *
            </label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              className="form-select"
              required
              disabled={loading}
            >
              <option value="web">🌐 Web</option>
              <option value="windows">🪟 Windows</option>
              <option value="macos">🍎 macOS</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="platform">
              Platform *
            </label>
            <input
              type="text"
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleInputChange}
              className="form-input"
              placeholder={getPlatformSuggestions(formData.source)[0] || 'e.g., Chrome, Windows 11'}
              required
              disabled={loading}
              list="platform-suggestions"
            />
            <datalist id="platform-suggestions">
              {getPlatformSuggestions(formData.source).map(suggestion => (
                <option key={suggestion} value={suggestion} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="application">
            Application
          </label>
          <input
            type="text"
            id="application"
            name="application"
            value={formData.application}
            onChange={handleInputChange}
            className="form-input"
            placeholder={getApplicationSuggestions(formData.source)[0] || 'e.g., Notepad++, Safari'}
            disabled={loading}
            list="app-suggestions"
          />
          <datalist id="app-suggestions">
            {getApplicationSuggestions(formData.source).map(suggestion => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>

        {formData.source === 'web' && (
          <div className="form-group">
            <label className="form-label" htmlFor="url">
              URL
            </label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://example.com"
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="tags">
            Tags
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              className="form-input"
              placeholder="Add a tag and press Enter"
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn"
              disabled={!tagInput.trim() || loading}
              style={{ minWidth: 'auto', padding: '0.75rem' }}
            >
              Add
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="item-tags" style={{ marginTop: '0.5rem' }}>
              {formData.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="tag" 
                  style={{ 
                    position: 'relative', 
                    paddingRight: '2rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRemoveTag(tag)}
                  title="Click to remove"
                >
                  {tag}
                  <span 
                    style={{ 
                      position: 'absolute', 
                      right: '0.5rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      fontSize: '0.7rem'
                    }}
                  >
                    ❌
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end',
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e0e0e0'
        }}>
          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{ minWidth: '120px' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ 
                  width: '16px', 
                  height: '16px', 
                  marginRight: '0.5rem',
                  borderWidth: '2px'
                }}></span>
                Adding...
              </>
            ) : (
              '➕ Add Context'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .error-message {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-input:invalid {
          border-color: #dc3545;
        }
        
        .form-input:valid {
          border-color: #28a745;
        }
        
        .tag:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};