import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchBooks, fetchMatches } from '../services/api';
import BookCard from '../components/BookCard';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [books, setBooks] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [booksRes, matchesRes] = await Promise.all([
          fetchBooks(),
          fetchMatches()
        ]);
        setBooks(booksRes.data || []);
        setMatches(matchesRes.data || []);
      } catch (e) {
        console.error('Failed to load dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const availableCount = books.filter(b => b.status === 'available').length;
  const wantedCount = books.filter(b => b.status === 'wanted').length;
  const totalMatchesCount = matches.length;

  const recentAvailable = books.filter(b => b.status === 'available').slice(0, 4);

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
      {/* Personalized Welcome Banner */}
      <div className="editorial-card" style={{
        backgroundColor: 'var(--color-forest-green)',
        color: '#FAF5E9',
        padding: '2.5rem 2rem',
        marginBottom: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-glow-green)'
      }}>
        {/* Subtle background leaves graphic */}
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          opacity: 0.12,
          pointerEvents: 'none'
        }}>
          <svg width="220" height="220" viewBox="0 0 100 100" fill="none">
            <path d="M50 0C60 30 90 40 100 50C70 60 60 90 50 100C40 70 10 60 0 50C30 40 40 10 50 0Z" fill="#F6E7A1" />
          </svg>
        </div>

        <div style={{ zIndex: 1, maxWidth: '580px' }}>
          <span style={{
            fontSize: '0.8rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--color-butter-yellow)',
            fontWeight: 700,
            display: 'block',
            marginBottom: '0.4rem'
          }}>
            Campus Student Exchange
          </span>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '0.6rem'
          }}>
            Hello, {currentUser?.fullName || currentUser?.name || 'Student'}!
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#D8CFBF',
            fontStyle: 'italic',
            fontFamily: 'var(--font-serif)'
          }}>
            "Ready to find your next chapter?"
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ zIndex: 1, display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link to="/discover" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Discover Books</span>
            <span style={{
              backgroundColor: 'var(--color-dark-espresso)',
              color: 'var(--color-warm-cream)',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Swipe
            </span>
          </Link>

          <Link to="/add-book" className="btn btn-outline btn-lg" style={{ color: '#FAF5E9', borderColor: '#FAF5E9' }}>
            + Add Your Book
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {/* Available Books */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#E2ECE5', color: 'var(--color-forest-green)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
              Available Books
            </span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-dark-espresso)' }}>
              {loading ? '...' : availableCount}
            </div>
            <Link to="/available" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
              Browse listings &rarr;
            </Link>
          </div>
        </div>

        {/* Wanted Books */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#FBE5E1', color: 'var(--color-muted-tomato)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
              Wanted Books
            </span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-dark-espresso)' }}>
              {loading ? '...' : wantedCount}
            </div>
            <Link to="/wanted" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-muted-tomato)' }}>
              View requests &rarr;
            </Link>
          </div>
        </div>

        {/* Total Matches */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: '#F6E7A1', color: 'var(--color-dark-espresso)' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Matches
            </span>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 700, color: 'var(--color-dark-espresso)' }}>
              {loading ? '...' : totalMatchesCount}
            </div>
            <Link to="/matches" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
              Check matches &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout: Left (Recently Added Books) & Right (Recent Matching Notifications & Quick Actions) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Recently Added Books */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '0.3rem' }}>
                Latest Arrivals
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-dark-espresso)' }}>
                Recently Added Books
              </h2>
            </div>
            <Link to="/available" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
              View all ({books.length}) &rarr;
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-espresso-subtle)' }}>
              Loading campus listings...
            </div>
          ) : recentAvailable.length === 0 ? (
            <div className="editorial-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p>No books added recently. Be the first to list one!</p>
              <Link to="/add-book" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                List a Book
              </Link>
            </div>
          ) : (
            <div className="books-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {recentAvailable.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Matching Notifications & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Recent Matching Notifications Card */}
          <div className="editorial-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem' }}>
                Exchange Alerts
              </h3>
              <span className="badge badge-yellow">
                {matches.length} active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matches.slice(0, 3).map(m => (
                <div key={m.id} style={{
                  padding: '0.85rem',
                  backgroundColor: 'var(--color-warm-cream)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-card-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-dark-espresso)' }}>
                      {m.bookTitle}
                    </span>
                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                      {m.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-espresso-subtle)', marginBottom: '0.4rem' }}>
                    Seller: {m.sellerName} • {m.matchedAt}
                  </p>
                  <Link to="/matches" style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--color-forest-green)' }}>
                    View Exchange Details &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="editorial-card" style={{ backgroundColor: 'var(--color-warm-cream)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', marginBottom: '0.85rem' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <Link to="/discover" className="btn btn-primary" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🔥</span>
                <span>Launch Swipe Discovery</span>
              </Link>
              <Link to="/add-book" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📖</span>
                <span>List a Book (I Have / I Want)</span>
              </Link>
              <Link to="/wanted" className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '0.75rem', backgroundColor: '#FFFFFF' }}>
                <span style={{ fontSize: '1.1rem' }}>🔍</span>
                <span>Search Wanted Textbooks</span>
              </Link>
            </div>
          </div>

          {/* Campus Eco Tip */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#E2ECE5',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #B7CEBF',
            fontSize: '0.82rem',
            color: 'var(--color-forest-green-dark)'
          }}>
            🌱 <strong>Eco-Friendly Campus:</strong> Passing on one textbook saves approximately 25 gallons of water and 15 pounds of raw timber.
          </div>
        </div>
      </div>
    </div>
  );
}
