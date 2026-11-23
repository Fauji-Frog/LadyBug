import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchBooks } from '../services/api';
import BookCard from '../components/BookCard';

export default function ProfilePage() {
  const { currentUser, updateProfile, isBackendOnline } = useAuth();
  const [activeTab, setActiveTab] = useState('listed'); // 'listed' or 'requested'
  const [isEditing, setIsEditing] = useState(false);
  const [books, setBooks] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [editForm, setEditForm] = useState({
    fullName: currentUser?.fullName || '',
    studentId: currentUser?.studentId || '',
    email: currentUser?.email || '',
    department: currentUser?.department || '',
    batch: currentUser?.batch || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || ''
  });

  useEffect(() => {
    async function loadUserBooks() {
      const res = await fetchBooks();
      setBooks(res.data || []);
    }
    loadUserBooks();
  }, []);

  // Filter books listed or requested by current student
  const myListed = books.filter(b =>
    b.status === 'available' &&
    (b.sellerName === currentUser?.fullName || b.sellerStudentId === currentUser?.studentId || b.id.includes('local'))
  );

  const myRequested = books.filter(b =>
    b.status === 'wanted' &&
    (b.studentName === currentUser?.fullName || b.studentId === currentUser?.studentId || b.id.includes('local'))
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Student Profile Identity Card */}
      <div className="editorial-card" style={{
        padding: '2.5rem 2rem',
        marginBottom: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          {/* Avatar and Basic Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: currentUser?.avatarBg || 'var(--color-forest-green)',
              color: '#FAF5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-serif)',
              fontSize: '2.4rem',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(52, 78, 65, 0.25)',
              border: '4px solid var(--color-warm-cream)'
            }}>
              {currentUser?.fullName?.charAt(0) || 'R'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-dark-espresso)' }}>
                  {currentUser?.fullName}
                </h1>
                <span className="badge badge-green">✓ Verified Campus Member</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-forest-green)', fontWeight: 600 }}>
                {currentUser?.department} • {currentUser?.batch}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-espresso-subtle)', marginTop: '0.25rem' }}>
                Student ID: <strong>{currentUser?.studentId}</strong> • Member since {currentUser?.joinedDate || 'Fall 2024'}
              </p>
            </div>
          </div>

          {/* Edit Profile Action */}
          <div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Bio / Quote */}
        {currentUser?.bio && !isEditing && (
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-card-border)',
            fontStyle: 'italic',
            color: 'var(--color-dark-espresso-muted)',
            fontSize: '0.92rem'
          }}>
            "{currentUser.bio}"
          </div>
        )}

        {/* Save Success Alert */}
        {saveSuccess && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            backgroundColor: '#EBF5EE',
            border: '1px solid #BDE3CA',
            color: '#1E4620',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            textAlign: 'center',
            fontWeight: 600
          }}>
            ✓ Profile updated successfully!
          </div>
        )}

        {/* Inline Profile Editor */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} style={{
            marginTop: '1.75rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--color-card-border)'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Edit Student Profile Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">University Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Bio</label>
              <textarea
                rows="2"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Tabs: Listed Books vs Requested Books */}
      <div className="tab-toggle-container" style={{ maxWidth: '520px', marginBottom: '2rem' }}>
        <button
          className={`tab-toggle-btn ${activeTab === 'listed' ? 'tab-toggle-active' : ''}`}
          onClick={() => setActiveTab('listed')}
        >
          My Listed Books ({myListed.length})
        </button>
        <button
          className={`tab-toggle-btn ${activeTab === 'requested' ? 'tab-toggle-active' : ''}`}
          onClick={() => setActiveTab('requested')}
        >
          My Requested Books ({myRequested.length})
        </button>
      </div>

      {/* Listed Books (I Have) */}
      {activeTab === 'listed' && (
        <div>
          {myListed.length === 0 ? (
            <div className="editorial-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <p style={{ color: 'var(--color-espresso-subtle)', marginBottom: '1rem' }}>
                You have not listed any textbooks for sale yet.
              </p>
              <a href="/add-book" className="btn btn-primary btn-sm">
                + List a Book for Sale
              </a>
            </div>
          ) : (
            <div className="books-grid">
              {myListed.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Requested Books (I Want) */}
      {activeTab === 'requested' && (
        <div>
          {myRequested.length === 0 ? (
            <div className="editorial-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <p style={{ color: 'var(--color-espresso-subtle)', marginBottom: '1rem' }}>
                You have not posted any wanted book requests yet.
              </p>
              <a href="/add-book" className="btn btn-primary btn-sm">
                + Post a Book Request
              </a>
            </div>
          ) : (
            <div className="books-grid">
              {myRequested.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
