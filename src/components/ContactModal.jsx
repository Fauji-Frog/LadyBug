import React, { useState } from 'react';

export default function ContactModal({ isOpen, onClose, book, type = 'seller' }) {
  if (!isOpen || !book) return null;

  const isSeller = type === 'seller';
  const personName = isSeller ? (book.sellerName || 'Elena Rostova') : (book.studentName || 'Student Requester');
  const personEmail = isSeller ? (book.sellerContact || 'elena.rostova@campus.edu') : (book.contact || 'student@campus.edu');
  const personPhone = book.phone || '+1 (555) 234-5678';
  const location = book.pickupLocation || 'Main Campus Library / Student Union';

  const [message, setMessage] = useState(
    isSeller
      ? `Hi ${personName}, I saw your listing for "${book.title}" on ReLeaf. Is it still available for $${book.price}? I can meet you at ${location}!`
      : `Hi ${personName}, I have a copy of "${book.title}" (${book.edition || 'standard edition'}) available for exchange. Let me know when you'd like to meet on campus!`
  );

  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(personEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendSimulated = (e) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(48, 40, 32, 0.65)',
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
        maxWidth: '520px',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--color-card-border)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.25s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          backgroundColor: 'var(--color-warm-cream)',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.4rem' }}>
              {isSeller ? 'Book Exchange Contact' : 'Respond to Request'}
            </span>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-espresso)' }}>
              Connect with {personName}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-card-border)',
              color: 'var(--color-dark-espresso)',
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Book Summary Card */}
          <div style={{
            backgroundColor: 'var(--color-warm-cream)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-card-border)',
            marginBottom: '1.25rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div style={{
              width: '42px',
              height: '56px',
              backgroundColor: book.coverBg || 'var(--color-forest-green)',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{
                fontSize: '0.95rem',
                fontFamily: 'var(--font-serif)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {book.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)' }}>
                {book.author} • {book.edition}
              </p>
              {book.price !== undefined && (
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-forest-green)' }}>
                  ${book.price}
                </span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#FAF7F0',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-card-border)'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-espresso-subtle)', fontWeight: 600 }}>
                Campus Email
              </span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark-espresso)' }}>
                  {personEmail}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--color-forest-green)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{
              padding: '0.75rem',
              backgroundColor: '#FAF7F0',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-card-border)'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-espresso-subtle)', fontWeight: 600 }}>
                Phone / WhatsApp
              </span>
              <div style={{ marginTop: '0.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark-espresso)' }}>
                {personPhone}
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <form onSubmit={handleSendSimulated}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--color-dark-espresso)',
              marginBottom: '0.4rem'
            }}>
              Send Quick Campus Exchange Message:
            </label>
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-card-border)',
                marginBottom: '1rem',
                fontSize: '0.88rem'
              }}
            />

            {sentSuccess && (
              <div style={{
                backgroundColor: '#EBF5EE',
                border: '1px solid #BDE3CA',
                color: '#1E4620',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                ✓ Message dispatched! {personName} will reach out via campus email.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem' }}
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Campus Safety Reminder */}
          <div style={{
            marginTop: '1.25rem',
            paddingTop: '0.75rem',
            borderTop: '1px dashed var(--color-card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-espresso-subtle)',
            fontSize: '0.75rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Campus Safety Tip: Always meet in well-lit public campus spots (e.g. library lobby, dining hall).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
