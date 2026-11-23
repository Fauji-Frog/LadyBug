import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import NotificationDropdown from './NotificationDropdown';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 90,
      backgroundColor: 'rgba(250, 245, 233, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-card-border)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <Logo size="medium" linkTo={isAuthenticated ? "/" : "/welcome"} />

        {/* Center Desktop Navigation Links */}
        {isAuthenticated && (
          <nav className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#FFFFFF',
            padding: '0.35rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-card-border)'
          }}>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Home
            </NavLink>

            <NavLink
              to="/discover"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <span>Discover</span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: 'var(--color-butter-yellow)',
                color: 'var(--color-dark-espresso)',
                padding: '0.1rem 0.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700
              }}>
                Swipe
              </span>
            </NavLink>

            <NavLink
              to="/add-book"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Add Book
            </NavLink>

            <NavLink
              to="/available"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Available
            </NavLink>

            <NavLink
              to="/wanted"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Wanted
            </NavLink>

            <NavLink
              to="/matches"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            >
              Matches
            </NavLink>
          </nav>
        )}

        {/* Right Side Actions: Notifications & Student Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification dropdown */}
              <NotificationDropdown />

              {/* Student Profile Pill */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.3rem 0.6rem 0.3rem 0.3rem',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-card-border)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: currentUser?.avatarBg || 'var(--color-forest-green)',
                    color: '#FAF5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {currentUser?.fullName?.charAt(0) || 'S'}
                  </div>
                  <span className="hide-mobile" style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--color-dark-espresso)',
                    maxWidth: '120px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {currentUser?.fullName?.split(' ')[0] || 'Student'}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <>
                    <div
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '240px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-card-border)',
                      boxShadow: 'var(--shadow-lg)',
                      zIndex: 100,
                      overflow: 'hidden',
                      padding: '0.5rem 0'
                    }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F0E8D8' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-dark-espresso)' }}>
                          {currentUser?.fullName}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-espresso-subtle)' }}>
                          {currentUser?.studentId}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-forest-green)', marginTop: '0.2rem' }}>
                          {currentUser?.department}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--color-dark-espresso)',
                          textDecoration: 'none'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>My Profile & Books</span>
                      </Link>

                      <Link
                        to="/matches"
                        onClick={() => setProfileDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--color-dark-espresso)',
                          textDecoration: 'none'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        <span>My Matches</span>
                      </Link>

                      <div style={{ borderTop: '1px solid #F0E8D8', margin: '0.4rem 0' }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 1rem',
                          fontSize: '0.88rem',
                          color: 'var(--color-muted-tomato)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Log Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
