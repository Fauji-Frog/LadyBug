import React, { useState } from 'react';
import ContactModal from './ContactModal';

export default function BookCard({ book, onInterest }) {
  const [modalOpen, setModalOpen] = useState(false);
  const isAvailable = book.status === 'available';

  const conditionColorMap = {
    'New': 'badge-green',
    'Good': 'badge-yellow',
    'Used': 'badge-peach'
  };

  return (
    <>
      <div className="editorial-card book-item-card" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative'
      }}>
        {/* Book Jacket Top Display */}
        <div style={{
          position: 'relative',
          height: '210px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: book.coverBg || 'var(--color-forest-green)',
          color: '#FAF5E9',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.3), 0 4px 12px rgba(48,40,32,0.12)',
          marginBottom: '1rem'
        }}>
          {/* Subtle Book Spine crease on left */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '14px',
            background: 'linear-gradient(to right, rgba(0,0,0,0.35), transparent)',
            pointerEvents: 'none'
          }} />

          {/* Top meta tags on jacket */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
            <span style={{
              fontSize: '0.68rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: book.coverAccent || 'var(--color-butter-yellow)',
              fontWeight: 700
            }}>
              {book.department || 'Academic'}
            </span>

            {isAvailable ? (
              <span className={`badge ${conditionColorMap[book.condition] || 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                {book.condition}
              </span>
            ) : (
              <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>
                Wanted
              </span>
            )}
          </div>

          {/* Book Title on Cover */}
          <div style={{ zIndex: 1, my: 'auto' }}>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.25,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {book.title}
            </h4>
            <p style={{
              fontSize: '0.78rem',
              color: book.coverAccent || 'var(--color-butter-yellow)',
              fontStyle: 'italic',
              marginTop: '0.35rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {book.author}
            </p>
          </div>

          {/* Bottom foil strip / Edition stamp */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            zIndex: 1,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '0.45rem'
          }}>
            <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>
              {book.edition}
            </span>
            {isAvailable && (
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: book.coverAccent || '#FFFFFF'
              }}>
                ${book.price}
              </span>
            )}
          </div>
        </div>

        {/* Card Details Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-forest-green)',
                color: '#FAF5E9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                {(book.sellerName || book.studentName || 'S').charAt(0)}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-dark-espresso)' }}>
                {book.sellerName || book.studentName}
              </span>
            </div>

            <p style={{
              fontSize: '0.78rem',
              color: 'var(--color-espresso-subtle)',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {book.description || book.notes || `Course: ${book.courseCode || 'General'} • Campus pickup ready.`}
            </p>
          </div>

          {/* Footer Action */}
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-card-border)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setModalOpen(true)}
                className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  fontSize: '0.85rem'
                }}
              >
                {isAvailable ? 'Connect with Seller' : 'I Have This Book'}
              </button>

              {isAvailable && onInterest && (
                <button
                  onClick={() => onInterest(book)}
                  className="btn btn-outline"
                  style={{
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-muted-tomato)',
                    borderColor: 'var(--color-muted-tomato)'
                  }}
                  title="Add to Swipe Interested"
                >
                  ♥
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact modal */}
      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        book={book}
        type={isAvailable ? 'seller' : 'requester'}
      />
    </>
  );
}
