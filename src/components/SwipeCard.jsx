import React, { useState, useRef, useEffect } from 'react';

export default function SwipeCard({ book, onSwipe, nextBook }) {
  const cardRef = useRef(null);

  // Position state during dragging
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(null); // 'left' or 'right'

  const startPos = useRef({ x: 0, y: 0 });
  const SWIPE_THRESHOLD = 110;

  // Handle Drag Start
  const handleStart = (clientX, clientY) => {
    if (isExiting) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  // Handle Drag Move
  const handleMove = (clientX, clientY) => {
    if (!isDragging || isExiting) return;
    const deltaX = clientX - startPos.current.x;
    const deltaY = (clientY - startPos.current.y) * 0.4; // subtle vertical resistance
    setDragOffset({ x: deltaX, y: deltaY });
  };

  // Handle Drag End
  const handleEnd = () => {
    if (!isDragging || isExiting) return;
    setIsDragging(false);

    if (dragOffset.x > SWIPE_THRESHOLD) {
      triggerSwipe('right');
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      triggerSwipe('left');
    } else {
      // Snap back smoothly
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const triggerSwipe = (direction) => {
    setIsExiting(true);
    setExitDirection(direction);
    const targetX = direction === 'right' ? window.innerWidth + 200 : -window.innerWidth - 200;
    setDragOffset({ x: targetX, y: dragOffset.y * 1.5 });

    setTimeout(() => {
      onSwipe(direction, book);
      setIsExiting(false);
      setExitDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 280);
  };

  // Mouse Listeners
  const onMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  useEffect(() => {
    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Touch Listeners
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    handleEnd();
  };

  // Rotation and Stamp Opacities
  const rotationDeg = dragOffset.x * 0.08;
  const interestedOpacity = Math.max(0, Math.min(1, dragOffset.x / 80));
  const passOpacity = Math.max(0, Math.min(1, -dragOffset.x / 80));

  return (
    <div className="swipe-container">
      {/* Background Stacking Layer 2 (Deep) */}
      <div className="swipe-card-bg-2" />

      {/* Background Stacking Layer 1 (Preview of Next Book) */}
      {nextBook ? (
        <div className="swipe-card-bg-1" style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}>
          {/* Header teaser */}
          <div style={{
            height: '180px',
            backgroundColor: nextBook.coverBg || 'var(--color-forest-green)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            color: '#FFFFFF',
            opacity: 0.8
          }}>
            <span style={{ fontSize: '0.7rem', color: nextBook.coverAccent || 'var(--color-butter-yellow)', fontWeight: 700 }}>
              {nextBook.department}
            </span>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
              {nextBook.title}
            </h4>
          </div>
          <div style={{ opacity: 0.5, textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-espresso-subtle)' }}>
            Next in stack...
          </div>
        </div>
      ) : (
        <div className="swipe-card-bg-1" />
      )}

      {/* Active Foreground Interactive Card */}
      <div
        ref={cardRef}
        className="swipe-card-stack swipe-card-active"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotationDeg}deg)`,
          transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Dynamic Stamp Badges */}
        <div
          className="swipe-stamp swipe-stamp-interested"
          style={{ opacity: interestedOpacity }}
        >
          INTERESTED
        </div>
        <div
          className="swipe-stamp swipe-stamp-pass"
          style={{ opacity: passOpacity }}
        >
          PASS
        </div>

        {/* Card Content Interior */}
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.25rem' }}>
          {/* Editorial Book Cover Header */}
          <div style={{
            height: '240px',
            backgroundColor: book.coverBg || 'var(--color-forest-green)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.25rem',
            color: '#FAF5E9',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 5px 0 10px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.15)'
          }}>
            {/* Book spine lighting */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: '18px',
              background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
              pointerEvents: 'none'
            }} />

            {/* Top row: Dept & Condition */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
              <span style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: book.coverAccent || 'var(--color-butter-yellow)'
              }}>
                {book.department}
              </span>

              <span className={`badge ${book.condition === 'New' ? 'badge-green' : book.condition === 'Good' ? 'badge-yellow' : 'badge-peach'}`} style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem'
              }}>
                {book.condition}
              </span>
            </div>

            {/* Title & Author on Cover */}
            <div style={{ zIndex: 1 }}>
              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 700,
                color: '#FFFFFF',
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                marginBottom: '0.4rem',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {book.title}
              </h3>
              <p style={{
                fontSize: '0.85rem',
                color: book.coverAccent || 'var(--color-butter-yellow)',
                fontStyle: 'italic',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }}>
                by {book.author}
              </p>
            </div>

            {/* Bottom: Edition & Price */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '0.5rem',
              zIndex: 1
            }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {book.edition}
              </span>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: book.coverAccent || '#FFFFFF'
              }}>
                ${book.price}
              </span>
            </div>
          </div>

          {/* Book Information Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              {/* Seller Information */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.55rem 0.75rem',
                backgroundColor: 'var(--color-warm-cream)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-card-border)',
                marginBottom: '0.75rem'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-forest-green)',
                  color: '#FAF5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {book.sellerName?.charAt(0) || 'S'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-dark-espresso)' }}>
                      {book.sellerName}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-forest-green)', fontWeight: 600 }}>
                      ✓ Verified Student
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-espresso-subtle)' }}>
                    {book.pickupLocation || 'Campus Quad Pickup'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '0.84rem',
                color: 'var(--color-dark-espresso-muted)',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                "{book.description || 'Pristine textbook copy. Great for this semester coursework.'}"
              </p>
            </div>

            {/* Gesture Tip */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--color-espresso-subtle)',
              borderTop: '1px dashed var(--color-card-border)',
              paddingTop: '0.5rem'
            }}>
              <span>← Drag Left to Pass</span>
              <span>Drag Right for Interested →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
