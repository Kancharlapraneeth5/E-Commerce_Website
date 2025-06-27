import React from 'react';
import { API_CONFIG } from './config/api';

const EnvironmentBadge = () => {
  if (API_CONFIG.IS_PRODUCTION) {
    return null; // Don't show in production
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: API_CONFIG.IS_DEVELOPMENT ? '#4CAF50' : '#FF9800',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif'
    }}>
      {API_CONFIG.ENVIRONMENT.toUpperCase()} MODE
      <br />
      <span style={{ fontSize: '10px' }}>
        API: {API_CONFIG.API_URL}
      </span>
    </div>
  );
};

export default EnvironmentBadge;
