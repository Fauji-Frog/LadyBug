import React, { useState, useEffect } from 'react';
import { fetchBooks } from '../services/api';
import ContactModal from '../components/ContactModal';

export default function WantedBooksPage() {
  const [wantedBooks, setWantedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [contactBook, setContactBook] = useState(null);

  useEffect(() => {
    async function loadWanted() {
      setLoading(true);
      try {
        const res = await fetchBooks('wanted');
        setWantedBooks(res.data.filter(b => b.status === 'wanted'));
      } catch (err) {
        console.error('Failed to load wanted books:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWanted();
  }, []);

  const filtered = wantedBooks.filter(b => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.department && b.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUrgency =
      selectedUrgency === 'all' ||
      b.urgency === selectedUrgency;

    return matchesSearch && matchesUrgency;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-red">Student Requests</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)' }}>
            {filtered.length} active requests
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-dark-espresso)', marginBottom: '0.5rem' }}>
          Wanted Textbooks Board
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-dark-espresso-muted)', maxWidth: '650px' }}>
          Students looking for specific books for their upcoming courses and exams. If you have any of these copies, reach out and pass them forward!
        </p>
      </div>

      {/* Search & Filter */}
      <div className="editorial-card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div className="input-with-icon" style={{ gridColumn: 'span 2' }}>
            <input
              type="text"
              placeholder="Search requested books by title, author, or field..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              🔍
            </span>
          </div>

          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
            >
              <option value="all">All Urgencies</option>
              <option value="Urgent">Urgent</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wanted Book Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-espresso-subtle)' }}>
          <p>Loading student requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            No Matching Requests Found
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-espresso-subtle)' }}>
            No students are currently searching for this title.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {filtered.map(book => (
            <div key={book.id} className="editorial-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              backgroundColor: '#FFFFFF'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                    {book.department || 'Academic'}
                  </span>
                  <span className={`badge ${book.urgency === 'Urgent' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.7rem' }}>
                    {book.urgency || 'Medium'} Urgency
                  </span>
                </div>

                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-dark-espresso)', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                  {book.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-espresso-subtle)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                  by {book.author} • {book.edition}
                </p>

                {book.notes && (
                  <p style={{
                    fontSize: '0.84rem',
                    color: 'var(--color-dark-espresso-muted)',
                    backgroundColor: 'var(--color-warm-cream)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-card-border)',
                    marginBottom: '1rem',
                    lineHeight: 1.45
                  }}>
                    "{book.notes}"
                  </p>
                )}
              </div>

              <div style={{
                borderTop: '1px solid var(--color-card-border)',
                paddingTop: '1rem',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-dark-espresso)', display: 'block' }}>
                    Requested by: {book.studentName}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-espresso-subtle)' }}>
                    {book.contact}
                  </span>
                </div>

                <button
                  onClick={() => setContactBook(book)}
                  className="btn btn-primary btn-sm"
                >
                  I Have This
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contact modal */}
      {contactBook && (
        <ContactModal
          isOpen={Boolean(contactBook)}
          onClose={() => setContactBook(null)}
          book={contactBook}
          type="requester"
        />
      )}
    </div>
  );
}
