import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SwipeCard from '../components/SwipeCard';
import { fetchBooks, saveLocalInterest, getLocalInterests } from '../services/api';
import confetti from 'canvas-confetti';

export default function DiscoverPage() {
  const [deck, setDeck] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]); // for undo functionality
  const [interestedBooks, setInterestedBooks] = useState([]);
  const [passedBooks, setPassedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatchToast, setShowMatchToast] = useState(false);
  const [lastActionBook, setLastActionBook] = useState(null);

  // Load available books for swiping
  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      try {
        const res = await fetchBooks('available');
        const available = res.data.filter(b => b.status === 'available');
        setDeck(available);

        // Load existing saved interests
        const existingInterests = getLocalInterests();
        const interestedIds = existingInterests
          .filter(i => i.type === 'interested')
          .map(i => i.bookId);
        const matches = available.filter(b => interestedIds.includes(b.id));
        setInterestedBooks(matches);
      } catch (err) {
        console.error('Failed to load books for discover:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const currentBook = deck[currentIndex];
  const nextBook = currentIndex + 1 < deck.length ? deck[currentIndex + 1] : null;

  // Handle Swipe (Right = Interested, Left = Pass)
  const handleSwipe = (direction, book) => {
    const isInterested = direction === 'right';

    // Save locally
    saveLocalInterest(book.id, isInterested ? 'interested' : 'passed');

    // Update history for undo
    setHistory(prev => [...prev, { book, direction, index: currentIndex }]);

    if (isInterested) {
      setInterestedBooks(prev => {
        if (!prev.some(b => b.id === book.id)) {
          return [book, ...prev];
        }
        return prev;
      });

      // Trigger delightful celebratory confetti on interest!
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#344E41', '#F6E7A1', '#D96C55', '#FAF5E9']
        });
      } catch {
        // graceful if confetti unavailable
      }

      setLastActionBook(book);
      setShowMatchToast(true);
      setTimeout(() => setShowMatchToast(false), 3000);
    } else {
      setPassedBooks(prev => [...prev, book]);
    }

    // Advance to next card
    setCurrentIndex(prev => prev + 1);
  };

  // Button triggers (Heart / X)
  const handleHeartClick = () => {
    if (!currentBook) return;
    handleSwipe('right', currentBook);
  };

  const handleXClick = () => {
    if (!currentBook) return;
    handleSwipe('left', currentBook);
  };

  // Undo Last Swipe
  const handleUndo = () => {
    if (history.length === 0 || currentIndex === 0) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setCurrentIndex(prev => Math.max(0, prev - 1));

    if (last.direction === 'right') {
      setInterestedBooks(prev => prev.filter(b => b.id !== last.book.id));
    } else {
      setPassedBooks(prev => prev.filter(b => b.id !== last.book.id));
    }
  };

  // Reset Deck
  const handleResetDeck = () => {
    setCurrentIndex(0);
    setHistory([]);
    setPassedBooks([]);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
      {/* Top Header & Progress */}
      <div style={{ textAlign: 'center', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-green">
            🔥 Campus Book Discovery
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-espresso-subtle)' }}>
            Tinder-Style Matching
          </span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: 'var(--color-dark-espresso)', marginBottom: '0.35rem' }}>
          Discover Textbooks
        </h1>

        {/* Book progress indicator */}
        <p style={{ fontSize: '0.92rem', color: 'var(--color-dark-espresso-muted)', fontWeight: 600 }}>
          {deck.length > 0 && currentIndex < deck.length ? (
            <>
              Discover your next book &ndash;{' '}
              <span style={{ color: 'var(--color-forest-green)', fontWeight: 700 }}>
                {currentIndex + 1} of {deck.length}
              </span>
            </>
          ) : (
            'You’ve reviewed all available textbooks for now!'
          )}
        </p>

        {/* Visual Progress Bar */}
        {deck.length > 0 && (
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#E6DCC8',
            borderRadius: 'var(--radius-full)',
            marginTop: '0.75rem',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, ((currentIndex) / deck.length) * 100)}%`,
              backgroundColor: 'var(--color-forest-green)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        )}
      </div>

      {/* Swipe Feedback Banner Toast */}
      {showMatchToast && lastActionBook && (
        <div style={{
          maxWidth: '440px',
          margin: '0 auto 1rem',
          backgroundColor: '#EBF5EE',
          border: '1.5px solid #BDE3CA',
          color: '#1E4620',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'modalSlideUp 0.25s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.25rem' }}>♥</span>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>
                Interest Saved!
              </p>
              <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.9 }}>
                "{lastActionBook.title}" added to your interest list.
              </p>
            </div>
          </div>
          <Link
            to="/matches"
            style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-forest-green)', textDecoration: 'underline' }}
          >
            Matches &rarr;
          </Link>
        </div>
      )}

      {/* Main Interactive Deck */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--color-espresso-subtle)' }}>
          <p>Gathering fresh campus textbooks...</p>
        </div>
      ) : currentIndex < deck.length ? (
        <div>
          {/* Swipe Card Component */}
          <SwipeCard
            key={currentBook.id}
            book={currentBook}
            nextBook={nextBook}
            onSwipe={handleSwipe}
          />

          {/* Swipe Action Buttons */}
          <div className="swipe-controls">
            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className="swipe-btn swipe-btn-undo"
              title="Undo last swipe"
              style={{ opacity: history.length === 0 ? 0.4 : 1, cursor: history.length === 0 ? 'not-allowed' : 'pointer' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
            </button>

            {/* Pass (X) Button */}
            <button
              onClick={handleXClick}
              className="swipe-btn swipe-btn-pass"
              title="Pass on this book (Swipe Left)"
              aria-label="Pass"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Interested (Heart) Button */}
            <button
              onClick={handleHeartClick}
              className="swipe-btn swipe-btn-interested"
              title="Interested in this book (Swipe Right)"
              aria-label="Interested"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Deck State */
        <div className="swipe-container">
          <div className="swipe-empty-deck">
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#E2ECE5',
              color: 'var(--color-forest-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              fontSize: '2rem'
            }}>
              📚
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--color-dark-espresso)' }}>
              Deck Completed!
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-espresso-subtle)', maxWidth: '340px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              You have explored all textbooks currently listed by students. You liked <strong>{interestedBooks.length}</strong> books!
            </p>

            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={handleResetDeck}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                ↺ Reshuffle Deck
              </button>
              <Link
                to="/matches"
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                View Matches ({interestedBooks.length}) &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Matching Logic Educational Note */}
      <div style={{
        maxWidth: '560px',
        margin: '2.5rem auto 0',
        padding: '1rem 1.25rem',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-card-border)',
        fontSize: '0.82rem',
        color: 'var(--color-dark-espresso-muted)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.25rem' }}>💡</span>
        <div>
          <strong style={{ color: 'var(--color-dark-espresso)' }}>How Discovery & Matching Works:</strong>
          <p style={{ marginTop: '0.2rem', lineHeight: 1.45 }}>
            A right swipe registers your interest in the textbook. Once the seller confirms availability or accepts your campus request, it appears as a confirmed match under <strong>My Matches</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
