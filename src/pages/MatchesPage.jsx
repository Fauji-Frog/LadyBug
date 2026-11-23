import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMatches, getLocalInterests, fetchBooks } from '../services/api';
import ContactModal from '../components/ContactModal';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [localInterests, setLocalInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('confirmed'); // 'confirmed' or 'interests'
  const [selectedBookForContact, setSelectedBookForContact] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [matchesRes, booksRes] = await Promise.all([
          fetchMatches(),
          fetchBooks('available')
        ]);
        setMatches(matchesRes.data || []);

        const savedInterests = getLocalInterests();
        const interestedIds = savedInterests
          .filter(i => i.type === 'interested')
          .map(i => i.bookId);

        const matchedBooks = (booksRes.data || []).filter(b => interestedIds.includes(b.id));
        setLocalInterests(matchedBooks);
      } catch (err) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Mutual Match':
        return <span className="badge badge-green">✓ Mutual Match</span>;
      case 'Pending Seller Response':
        return <span className="badge badge-yellow">⏳ Pending Seller</span>;
      case 'Completed':
        return <span className="badge badge-peach">✓ Completed Exchange</span>;
      default:
        return <span className="badge badge-green">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-green">Campus Connections</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)' }}>
            {matches.length} confirmed exchanges
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-dark-espresso)', marginBottom: '0.5rem' }}>
          My Matches & Exchanges
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-dark-espresso-muted)', maxWidth: '650px' }}>
          Review confirmed textbook matches returned from campus classmates. Direct contact coordinates are unlocked for in-person pickups.
        </p>
      </div>

      {/* Tabs: Confirmed Matches vs Swiped Interests */}
      <div className="tab-toggle-container" style={{ maxWidth: '520px', marginBottom: '2rem' }}>
        <button
          className={`tab-toggle-btn ${activeTab === 'confirmed' ? 'tab-toggle-active' : ''}`}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed Matches ({matches.length})
        </button>
        <button
          className={`tab-toggle-btn ${activeTab === 'interests' ? 'tab-toggle-active' : ''}`}
          onClick={() => setActiveTab('interests')}
        >
          Swipe Interests ({localInterests.length})
        </button>
      </div>

      {/* Tab 1: Confirmed Matches from Backend */}
      {activeTab === 'confirmed' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-espresso-subtle)' }}>
              Checking campus exchange matches...
            </div>
          ) : matches.length === 0 ? (
            <div className="editorial-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                No Confirmed Matches Yet
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-espresso-subtle)', marginBottom: '1.5rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Keep swiping on the Discover deck or list books from your past courses to match with classmates!
              </p>
              <Link to="/discover" className="btn btn-primary">
                Go to Swipe Discover &rarr;
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {matches.map(m => (
                <div key={m.id} className="editorial-card" style={{
                  padding: '1.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.5rem'
                }}>
                  {/* Left Column: Book Details */}
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      {getStatusBadge(m.status)}
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-espresso-subtle)' }}>
                        Matched {m.matchedAt}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--color-dark-espresso)', marginBottom: '0.25rem' }}>
                      {m.bookTitle}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-espresso-subtle)' }}>
                      {m.edition} • Condition: {m.condition || 'Good'}
                    </p>

                    {m.notes && (
                      <p style={{
                        marginTop: '0.6rem',
                        fontSize: '0.84rem',
                        color: 'var(--color-dark-espresso-muted)',
                        backgroundColor: 'var(--color-warm-cream)',
                        padding: '0.5rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'inline-block'
                      }}>
                        {m.notes}
                      </p>
                    )}
                  </div>

                  {/* Middle: Seller Info */}
                  <div style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: 'var(--color-warm-cream)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-card-border)',
                    minWidth: '220px'
                  }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-espresso-subtle)', fontWeight: 600 }}>
                      Seller Contact
                    </span>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-dark-espresso)', marginTop: '0.15rem' }}>
                      {m.sellerName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-forest-green)', fontWeight: 600 }}>
                      {m.sellerContact}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--color-espresso-subtle)', marginTop: '0.2rem' }}>
                      📍 {m.exchangeLocation || 'Central Campus Library'}
                    </div>
                  </div>

                  {/* Right: Price & Contact Button */}
                  <div style={{ textAlign: 'right', minWidth: '140px' }}>
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: 'var(--color-forest-green)',
                      marginBottom: '0.5rem'
                    }}>
                      ${m.sellerPrice}
                    </div>
                    <button
                      onClick={() => setSelectedBookForContact({
                        title: m.bookTitle,
                        edition: m.edition,
                        sellerName: m.sellerName,
                        sellerContact: m.sellerContact,
                        phone: m.phone || '+1 (555) 234-5678',
                        pickupLocation: m.exchangeLocation,
                        price: m.sellerPrice
                      })}
                      className="btn btn-primary btn-sm"
                    >
                      Connect / Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Locally Saved Swipe Interests */}
      {activeTab === 'interests' && (
        <div>
          <div style={{
            backgroundColor: 'var(--color-warm-cream)',
            border: '1px solid var(--color-card-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            color: 'var(--color-dark-espresso-muted)'
          }}>
            ℹ️ <strong>Swipe Interest Queue:</strong> These are textbooks you swiped right on in the Discover Deck. They are stored in your student interest queue. Once the seller marks your exchange interest as mutual, it unlocks direct contact coordinates in the Confirmed Matches tab!
          </div>

          {localInterests.length === 0 ? (
            <div className="editorial-card" style={{ textAlign: 'center', padding: '3.5rem' }}>
              <p>You haven't swiped right on any books yet.</p>
              <Link to="/discover" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Open Discover Deck
              </Link>
            </div>
          ) : (
            <div className="books-grid">
              {localInterests.map(book => (
                <div key={book.id} className="editorial-card" style={{ padding: '1.25rem' }}>
                  <div style={{
                    height: '160px',
                    backgroundColor: book.coverBg,
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: book.coverAccent, fontWeight: 700 }}>
                      {book.department}
                    </span>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: '#FFFFFF' }}>
                      {book.title}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.72rem' }}>{book.edition}</span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700 }}>
                        ${book.price}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                      ♥ Swiped Right
                    </span>
                    <button
                      onClick={() => setSelectedBookForContact(book)}
                      className="btn btn-outline btn-sm"
                    >
                      Direct Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact modal */}
      {selectedBookForContact && (
        <ContactModal
          isOpen={Boolean(selectedBookForContact)}
          onClose={() => setSelectedBookForContact(null)}
          book={selectedBookForContact}
          type="seller"
        />
      )}
    </div>
  );
}
