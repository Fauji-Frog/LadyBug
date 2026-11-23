import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BackendStatusBar() {
  const { isBackendOnline, checkingBackend, verifyBackend } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      backgroundColor: isBackendOnline ? '#EBF5EE' : '#FFF6E0',
      borderBottom: `1px solid ${isBackendOnline ? '#BDE3CA' : '#F2DCA5'}`,
      color: isBackendOnline ? '#1E4620' : '#6B4804',
      fontSize: '0.82rem',
      padding: '0.45rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      position: 'relative',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isBackendOnline ? '#2D9A4C' : '#E08E0B',
          boxShadow: `0 0 0 2px ${isBackendOnline ? 'rgba(45,154,76,0.25)' : 'rgba(224,142,11,0.25)'}`
        }} />
        <span style={{ fontWeight: 600 }}>
          {isBackendOnline ? 'Live Backend Connected' : 'Frontend Preview / Standalone Mode'}
        </span>
        <span style={{ opacity: 0.9 }}>
          {isBackendOnline
            ? 'Serving live API data from http://localhost:5000/api'
            : 'Target API (http://localhost:5000/api) is offline. Using interactive local textbook dataset.'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={verifyBackend}
          disabled={checkingBackend}
          style={{
            fontSize: '0.75rem',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            backgroundColor: isBackendOnline ? 'rgba(45,154,76,0.1)' : 'rgba(224,142,11,0.15)',
            color: 'inherit',
            border: `1px solid ${isBackendOnline ? '#BDE3CA' : '#E2C785'}`,
            cursor: 'pointer',
            fontWeight: 600
          }}
          title="Check connection to http://localhost:5000/api"
        >
          {checkingBackend ? 'Checking...' : 'Check API'}
        </button>

        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            fontSize: '1rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '0 0.3rem',
            opacity: 0.6
          }}
          title="Dismiss banner"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
