import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { INITIAL_BOOKS } from '../data/mockData';

export default function LandingPage() {
  const featuredBooks = INITIAL_BOOKS.slice(0, 3);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Column: Headline, Brand Tagline, CTAs */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span className="badge badge-green" style={{ padding: '0.35rem 0.85rem' }}>
                  🌿 University Textbook Exchange
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)', fontStyle: 'italic' }}>
                  By Students, For Students
                </span>
              </div>

              <h1 className="hero-tagline">
                Give Books a <br />
                <span style={{ color: 'var(--color-forest-green)', fontStyle: 'italic' }}>New Chapter.</span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--color-dark-espresso-muted)',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '520px'
              }}>
                ReLeaf connects university students to buy, sell, request, and discover second-hand academic textbooks. Save money, reduce campus paper waste, and pass your wisdom forward.
              </p>

              {/* Action Buttons */}
              <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/discover" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span>Discover Books</span>
                  <span style={{
                    backgroundColor: 'var(--color-butter-yellow)',
                    color: 'var(--color-dark-espresso)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Swipe Deck
                  </span>
                </Link>

                <Link to="/register" className="btn btn-secondary btn-lg">
                  Join Campus Exchange
                </Link>

                <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--color-card-border)' }}>
                  Log In
                </Link>
              </div>

              {/* Trust & Environmental Callouts */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-card-border)'
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-forest-green)' }}>
                    $180+
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-espresso-subtle)' }}>
                    Avg. Semester Savings
                  </p>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-forest-green)' }}>
                    100%
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-espresso-subtle)' }}>
                    Verified Student Peer-to-Peer
                  </p>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-forest-green)' }}>
                    Zero
                  </span>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-espresso-subtle)' }}>
                    Retail Bookstore Markups
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Botanical Book Illustration */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              {/* Botanical Background Glow */}
              <div style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-butter-yellow)',
                opacity: 0.35,
                filter: 'blur(40px)',
                zIndex: 0
              }} />

              {/* Book Deck Display Mockup */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                maxWidth: '380px',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid var(--color-card-border)',
                boxShadow: 'var(--shadow-lg)',
                padding: '1.5rem',
                transform: 'rotate(-2deg)'
              }}>
                <div style={{
                  height: '240px',
                  backgroundColor: 'var(--color-forest-green)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  color: '#FAF5E9',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-butter-yellow)', fontWeight: 700, textTransform: 'uppercase' }}>
                      Algorithms • CS301
                    </span>
                    <span className="badge badge-yellow" style={{ fontSize: '0.7rem' }}>
                      Good Condition
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: '#FFFFFF', lineHeight: 1.25 }}>
                      Introduction to Algorithms
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-butter-yellow)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      Cormen, Leiserson, Rivest, Stein
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem' }}>4th Edition</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-butter-yellow)' }}>
                      $45
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--color-forest-green)', color: '#FAF5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      E
                    </span>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', color: 'var(--color-dark-espresso)' }}>
                        Elena Rostova
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-espresso-subtle)' }}>
                        Engineering Library pickup
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                    ♥ Swipe Match
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How ReLeaf Works Section */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-card-border)',
        borderBottom: '1px solid var(--color-card-border)'
      }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem' }}>
              Simple 3-Step Process
            </span>
            <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-espresso)', marginBottom: '1rem' }}>
              How ReLeaf Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-dark-espresso-muted)' }}>
              No complicated shipping, no bookstore middleman fees. Just direct student-to-student textbook discovery.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {/* Step 1 */}
            <div className="editorial-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-warm-cream)',
                border: '1.5px solid var(--color-card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--color-forest-green)',
                marginBottom: '1.25rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                List or Request a Book
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-espresso-muted)', lineHeight: 1.6 }}>
                Finished a semester? List your books for sale in under a minute under <strong>"I Have"</strong>. Looking for a course text? Post an <strong>"I Want"</strong> request.
              </p>
            </div>

            {/* Step 2 */}
            <div className="editorial-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#F6E7A1',
                border: '1.5px solid #E5D588',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--color-dark-espresso)',
                marginBottom: '1.25rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                Tinder-Style Book Discovery
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-espresso-muted)', lineHeight: 1.6 }}>
                Open our signature <strong>Discover Swipe Deck</strong>. Swipe right on textbooks you need, swipe left to pass. Natural touch and mouse gestures make discovery delightful.
              </p>
            </div>

            {/* Step 3 */}
            <div className="editorial-card" style={{ padding: '2rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#E2ECE5',
                border: '1.5px solid #B7CEBF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-serif)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--color-forest-green)',
                marginBottom: '1.25rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem' }}>
                Meet on Campus & Exchange
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-dark-espresso-muted)', lineHeight: 1.6 }}>
                Connect directly through verified campus email or WhatsApp. Meet up in the campus library or student quad to inspect the book and complete your exchange safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campus Listings Preview */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
                Live Marketplace
              </span>
              <h2 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-espresso)' }}>
                Recently Added on Campus
              </h2>
            </div>
            <Link to="/available" className="btn btn-outline">
              Browse All Available &rarr;
            </Link>
          </div>

          <div className="books-grid">
            {featuredBooks.map(book => (
              <div key={book.id} className="editorial-card" style={{ padding: '1.25rem' }}>
                <div style={{
                  height: '180px',
                  backgroundColor: book.coverBg,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  color: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  boxShadow: 'inset 3px 0 6px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.68rem', color: book.coverAccent, fontWeight: 700 }}>
                      {book.department}
                    </span>
                    <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>
                      {book.condition}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#FFFFFF' }}>
                      {book.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: book.coverAccent, fontStyle: 'italic' }}>
                      {book.author}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem' }}>{book.edition}</span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 700 }}>
                      ${book.price}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-espresso-subtle)' }}>
                    Seller: {book.sellerName}
                  </span>
                  <Link to="/discover" className="btn btn-primary btn-sm">
                    View in Discover
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{
        padding: '4.5rem 0',
        backgroundColor: 'var(--color-forest-green)',
        color: '#FAF5E9',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <Logo size="large" light={true} />
          <h2 style={{
            fontSize: '2.5rem',
            fontFamily: 'var(--font-serif)',
            color: '#FFFFFF',
            margin: '1.5rem 0 1rem'
          }}>
            Ready to find your next chapter?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#D8CFBF',
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Join fellow students on campus who are saving money and giving second-hand textbooks a second life.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Create Student Account
            </Link>
            <Link to="/discover" className="btn btn-outline btn-lg" style={{ color: '#FAF5E9', borderColor: '#FAF5E9' }}>
              Explore Swipe Deck
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
