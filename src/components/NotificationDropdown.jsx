import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '0.5rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isOpen ? 'rgba(52, 78, 65, 0.1)' : 'transparent',
          color: 'var(--color-forest-green)',
          border: '1px solid var(--color-card-border)',
          cursor: 'pointer'
        }}
        aria-label="Notifications"
        title="Notifications"
      >
        {/* Bell SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: 'var(--color-muted-tomato)',
            color: '#FFFFFF',
            fontSize: '0.68rem',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--color-warm-cream)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 199
            }}
          />

          {/* Dropdown Card */}
          <div style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '340px',
            maxWidth: '90vw',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-card-border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 200,
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.9rem 1.1rem',
              borderBottom: '1px solid var(--color-card-border)',
              backgroundColor: 'var(--color-warm-cream)'
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1rem', color: 'var(--color-dark-espresso)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-forest-green)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link}
                  onClick={() => handleNotificationClick(n.id)}
                  style={{
                    display: 'block',
                    padding: '0.85rem 1.1rem',
                    borderBottom: '1px solid #F0E8D8',
                    backgroundColor: n.read ? '#FFFFFF' : 'rgba(246, 231, 161, 0.15)',
                    transition: 'background var(--transition-fast)',
                    textDecoration: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      marginTop: '6px',
                      backgroundColor: n.read ? 'transparent' : 'var(--color-muted-tomato)',
                      flexShrink: 0
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '0.85rem',
                        fontWeight: n.read ? 600 : 700,
                        color: 'var(--color-dark-espresso)',
                        marginBottom: '0.2rem'
                      }}>
                        {n.title}
                      </p>
                      <p style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-dark-espresso-muted)',
                        lineHeight: 1.4,
                        marginBottom: '0.3rem'
                      }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-espresso-subtle)' }}>
                        {n.time}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '0.7rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-warm-cream)',
              borderTop: '1px solid var(--color-card-border)'
            }}>
              <Link
                to="/matches"
                onClick={() => setIsOpen(false)}
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-forest-green)' }}
              >
                View All Matches &rarr;
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
