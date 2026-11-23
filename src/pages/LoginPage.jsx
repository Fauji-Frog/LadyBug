import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Fresh, clean inputs with NO demo data
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [infoMessage, setInfoMessage] = useState(location.state?.message || '');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!identifier.trim()) {
      errs.identifier = 'Email or Student ID is required.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await login(identifier, password, rememberMe);
      if (res.success) {
        navigate('/');
      } else {
        setServerError(res.error || 'Invalid student credentials. Please verify your login details.');
      }
    } catch {
      setServerError('An unexpected error occurred while connecting. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotSent(false);
      setForgotModalOpen(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem',
        position: 'relative'
      }}>
        {/* Top Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="large" withTagline={true} />
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            color: 'var(--color-dark-espresso)',
            marginTop: '1.25rem',
            marginBottom: '0.35rem'
          }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-espresso-subtle)' }}>
            Log in to manage your campus textbooks and matches.
          </p>
        </div>

        {/* Info Message (e.g. from registration) */}
        {infoMessage && (
          <div style={{
            backgroundColor: '#EBF5EE',
            border: '1px solid #BDE3CA',
            color: '#1E4620',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}>
            ✓ {infoMessage}
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && (
          <div style={{
            backgroundColor: 'var(--color-muted-tomato-light)',
            border: '1px solid #F2B9B0',
            color: 'var(--color-muted-tomato-dark)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            fontWeight: 500
          }}>
            {serverError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email or Student ID */}
          <div className="form-group">
            <label className="form-label" htmlFor="identifier">
              University Email or Student ID
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="e.g. rowan@campus.edu or ST-2024-4219"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors({ ...errors, identifier: '' });
              }}
              style={{ borderColor: errors.identifier ? 'var(--color-muted-tomato)' : undefined }}
            />
            {errors.identifier && <span className="form-error-msg">{errors.identifier}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-forest-green)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your student password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                style={{ borderColor: errors.password ? 'var(--color-muted-tomato)' : undefined }}
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="form-error-msg">{errors.password}</span>}
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--color-forest-green)', cursor: 'pointer' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'var(--color-dark-espresso)', cursor: 'pointer' }}>
              Remember me on this campus device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.5rem' }}
          >
            {isSubmitting ? 'Authenticating...' : 'Log In to ReLeaf'}
          </button>

          {/* Link to Registration */}
          <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--color-dark-espresso-muted)' }}>
            New to ReLeaf?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-forest-green)', textDecoration: 'underline' }}>
              Create a Student Account
            </Link>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(48, 40, 32, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '420px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--color-card-border)',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-dark-espresso)' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-espresso-subtle)', marginBottom: '1.25rem' }}>
              Enter your university email address. We will send you a secure password reset link.
            </p>

            <form onSubmit={handleForgotSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="e.g. student@university.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              {forgotSent && (
                <div style={{
                  backgroundColor: '#EBF5EE',
                  border: '1px solid #BDE3CA',
                  color: '#1E4620',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  marginBottom: '1rem',
                  textAlign: 'center'
                }}>
                  ✓ Reset link sent to your campus inbox!
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
