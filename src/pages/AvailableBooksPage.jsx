import React, { useState, useEffect } from 'react';
import { fetchBooks, saveLocalInterest } from '../services/api';
import BookCard from '../components/BookCard';

export default function AvailableBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEdition, setSelectedEdition] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [interestAlert, setInterestAlert] = useState(null);

  useEffect(() => {
    async function loadAvailable() {
      setLoading(true);
      try {
        const res = await fetchBooks('available');
        setBooks(res.data.filter(b => b.status === 'available'));
      } catch (err) {
        console.error('Failed to load available books:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAvailable();
  }, []);

  // Filter books based on search and filters
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.courseCode && book.courseCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesEdition =
      selectedEdition === 'all' ||
      book.edition.toLowerCase().includes(selectedEdition.toLowerCase());

    const matchesCondition =
      selectedCondition === 'all' ||
      book.condition === selectedCondition;

    const matchesDept =
      selectedDept === 'all' ||
      book.department === selectedDept;

    return matchesSearch && matchesEdition && matchesCondition && matchesDept;
  });

  const handleInterest = (book) => {
    saveLocalInterest(book.id, 'interested');
    setInterestAlert(`Added "${book.title}" to your Interested list!`);
    setTimeout(() => setInterestAlert(null), 3000);
  };

  const departments = ['all', ...new Set(books.map(b => b.department).filter(Boolean))];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-green">Campus Marketplace</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)' }}>
            {filteredBooks.length} available textbooks
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', color: 'var(--color-dark-espresso)', marginBottom: '0.5rem' }}>
          Available Textbooks
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-dark-espresso-muted)', maxWidth: '650px' }}>
          Browse verified textbooks listed by university classmates. Use filters or search to quickly find required course texts.
        </p>
      </div>

      {/* Floating Interest Alert Toast */}
      {interestAlert && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: 'var(--color-forest-green)',
          color: '#FAF5E9',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontWeight: 600,
          fontSize: '0.88rem',
          animation: 'modalSlideUp 0.25s ease-out'
        }}>
          ♥ {interestAlert}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="editorial-card" style={{ padding: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center'
        }}>
          {/* Search Input */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder="Search by title, author, or course (e.g. Algorithms, CS301)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
              <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                🔍
              </span>
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Used">Used</option>
            </select>
          </div>
        </div>

        {/* Quick Clear Filter Link */}
        {(searchQuery || selectedEdition !== 'all' || selectedCondition !== 'all' || selectedDept !== 'all') && (
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedEdition('all');
                setSelectedCondition('all');
                setSelectedDept('all');
              }}
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-muted-tomato)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear all filters &times;
            </button>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-espresso-subtle)' }}>
          <p>Loading textbooks from campus...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="editorial-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            No Matching Textbooks Found
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-espresso-subtle)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            We couldn't find textbooks matching your search criteria. Try loosening your filters or post a request under Wanted.
          </p>
          <a
            href="/add-book"
            className="btn btn-secondary"
          >
            Post an "I Want" Request &rarr;
          </a>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onInterest={handleInterest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
