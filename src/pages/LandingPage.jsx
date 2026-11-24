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
              {/* Standalone Community Pill: By Students, For Students */}
              <div className="hero-community-pill">
                <span className="pill-sparkle">✦</span>
                <span className="pill-tag">By Students, For Students</span>
                <span className="pill-divider">•</span>
                <span className="pill-subtitle">Direct Campus Exchange</span>
              </div>

              <h1 className="hero-tagline">
                Give Textbooks a <br />
                <span style={{ color: 'var(--color-forest-green)', fontStyle: 'italic' }}>
                  New Chapter.
                </span>
              </h1>

              <p style={{
                fontSize: '1.15rem',
                color: 'var(--color-dark-espresso-muted)',
                lineHeight: 1.65,
                marginBottom: '2rem',
                maxWidth: '520px'
              }}>
                ReLeaf connects university students to buy, sell, swap, and discover second-hand academic textbooks with zero middleman fees. Meet up in your campus library and pass your knowledge forward.
              </p>

              {/* 3D Tactile Action Buttons */}
              <div className="hero-cta-group" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/discover" className="btn btn-3d btn-3d-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span>Discover Books</span>
                  <span style={{
                    backgroundColor: 'var(--color-butter-yellow)',
                    color: 'var(--color-dark-espresso)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}>
                    Swipe Deck
                  </span>
                </Link>

                <Link to="/register" className="btn btn-3d btn-3d-secondary btn-lg">
                  Join Campus Exchange
                </Link>

                <Link to="/login" className="btn btn-3d btn-3d-outline btn-lg">
                  Log In
                </Link>
              </div>

              {/* Trust & Environmental Callouts */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2.5rem',
                marginTop: '2.75rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--color-card-border)',
                flexWrap: 'wrap'
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest-green)' }}>
                    $180+
                  </span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-espresso-subtle)', fontWeight: 500 }}>
                    Avg. Semester Savings
                  </p>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest-green)' }}>
                    100%
                  </span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-espresso-subtle)', fontWeight: 500 }}>
                    Verified Student Peers
                  </p>
                </div>
                <div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-forest-green)' }}>
                    Zero
                  </span>
                  <p style={{ fontSize: '0.76rem', color: 'var(--color-espresso-subtle)', fontWeight: 500 }}>
                    Bookstore Markups
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Perspective Book Physics Stage */}
            <div className="hero-3d-stage">
              {/* Ambient Glow */}
              <div className="hero-3d-ambient-glow" />

              {/* 3D Floor Shadow */}
              <div className="book-3d-floor-shadow" />

              {/* 3D Scene */}
              <div className="book-3d-scene" title="Interactive 3D Book - Hover to Inspect">
                {/* Secondary Book in Stack (Angled Terracotta Book) */}
                <div className="book-3d-under">
                  <span className="book-3d-under-spine-text">
                    MOLECULAR BIOLOGY • 6TH ED
                  </span>
                </div>

                {/* Main Front Hardcover Book */}
                <div className="book-3d-cover">
                  {/* Decorative Gold Foil Frame */}
                  <div className="book-cover-foil-frame" />

                  {/* Satin Ribbon Bookmark */}
                  <div className="book-silk-ribbon" />

                  {/* Botanical Vine Watermark */}
                  <div className="book-cover-botanical">
                    <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                      <path d="M50 0C60 30 90 40 100 50C70 60 60 90 50 100C40 70 10 60 0 50C30 40 40 10 50 0Z" fill="#F6E7A1" />
                    </svg>
                  </div>

                  {/* Book Header */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-butter-yellow)',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                      }}>
                        CS301 • ALGORITHMS
                      </span>
                      <span className="badge badge-yellow" style={{ fontSize: '0.65rem', fontWeight: 800 }}>
                        VERIFIED
                      </span>
                    </div>
                    <div style={{ width: '40px', height: '2px', backgroundColor: 'var(--color-butter-yellow)', opacity: 0.8 }} />
                  </div>

                  {/* Book Center Content */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.65rem',
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      marginBottom: '0.4rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      Introduction to Algorithms
                    </h2>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-butter-yellow)',
                      fontStyle: 'italic',
                      opacity: 0.95
                    }}>
                      Cormen, Leiserson, Rivest & Stein
                    </p>
                  </div>

                  {/* Book Footer */}
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderTop: '1px solid rgba(255,255,255,0.25)',
                    paddingTop: '0.75rem'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#D8CFBF', display: 'block' }}>Hardcover Edition</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campus Quad</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: '#F2C6A8', textDecoration: 'line-through', marginRight: '0.4rem' }}>$130</span>
                      <span style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        color: 'var(--color-butter-yellow)'
                      }}>
                        $45
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Satellite Badge 1 (Top-Right: Pickup) */}
                <div className="floating-3d-badge floating-badge-pickup">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-forest-green)',
                      color: '#FAF5E9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}>
                      E
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-espresso)' }}>Elena R.</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--color-forest-green)', fontWeight: 700 }}>✓ Verified Seller</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-espresso-subtle)' }}>
                        ⚡ Engineering Library Pickup
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Satellite Badge 2 (Bottom-Left: Match) */}
                <div className="floating-3d-badge floating-badge-match">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-muted-tomato-light)',
                      color: 'var(--color-muted-tomato)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem'
                    }}>
                      ♥
                    </div>
                    <div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-dark-espresso)', display: 'block' }}>
                        98% Course Match!
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-forest-green)', fontWeight: 600 }}>
                        Swipe right in Discover deck
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating 3D Price Tag (Left) */}
                <div className="floating-3d-badge floating-badge-price">
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-dark-espresso)', letterSpacing: '0.04em' }}>
                    🏷️ SAVE $85 (65% OFF)
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
            <span className="badge badge-yellow" style={{ marginBottom: '0.75rem', fontWeight: 700 }}>
              Direct Student Workflow
            </span>
            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-espresso)', marginBottom: '1rem' }}>
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
            <div className="feature-card-3d">
              <span className="feature-number-3d">01</span>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-warm-cream)',
                border: '1.5px solid var(--color-card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 10px rgba(48, 40, 32, 0.08)'
              }}>
                📚
              </div>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem', color: 'var(--color-dark-espresso)' }}>
                List or Request a Book
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-dark-espresso-muted)', lineHeight: 1.65 }}>
                Finished your semester? List books for sale in under a minute under <strong>"I Have"</strong>. Missing a course text? Post an <strong>"I Want"</strong> request.
              </p>
            </div>

            {/* Step 2 */}
            <div className="feature-card-3d">
              <span className="feature-number-3d">02</span>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#F6E7A1',
                border: '1.5px solid #E5D588',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 10px rgba(246, 231, 161, 0.4)'
              }}>
                ✨
              </div>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem', color: 'var(--color-dark-espresso)' }}>
                Tinder-Style Book Discovery
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-dark-espresso-muted)', lineHeight: 1.65 }}>
                Open our signature <strong>Discover Swipe Deck</strong>. Swipe right on textbooks you need, swipe left to pass. Natural touch and mouse gestures make discovery delightful.
              </p>
            </div>

            {/* Step 3 */}
            <div className="feature-card-3d">
              <span className="feature-number-3d">03</span>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#E2ECE5',
                border: '1.5px solid #B7CEBF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                boxShadow: '0 4px 10px rgba(52, 78, 65, 0.2)'
              }}>
                🤝
              </div>
              <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-serif)', marginBottom: '0.75rem', color: 'var(--color-dark-espresso)' }}>
                Campus Meetup & Exchange
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--color-dark-espresso-muted)', lineHeight: 1.65 }}>
                Connect directly with fellow students. Meet up in your university library or student quad to inspect the book and complete your exchange safely.
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
              <span className="badge badge-green" style={{ marginBottom: '0.5rem', fontWeight: 700 }}>
                Live Campus Feed
              </span>
              <h2 style={{ fontSize: '2.4rem', fontFamily: 'var(--font-serif)', color: 'var(--color-dark-espresso)' }}>
                Recently Added on Campus
              </h2>
            </div>
            <Link to="/available" className="btn btn-3d btn-3d-outline">
              Browse All Available &rarr;
            </Link>
          </div>

          <div className="books-grid">
            {featuredBooks.map(book => (
              <div key={book.id} className="book-cover-3d-card">
                <div className="editorial-card book-cover-3d-inner" style={{ padding: '1.35rem' }}>
                  <div style={{
                    height: '190px',
                    backgroundColor: book.coverBg,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    marginBottom: '1.15rem',
                    boxShadow: 'inset 4px 0 8px rgba(0,0,0,0.35)',
                    borderLeft: '6px solid rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.68rem', color: book.coverAccent, fontWeight: 800, textTransform: 'uppercase' }}>
                        {book.department}
                      </span>
                      <span className="badge badge-yellow" style={{ fontSize: '0.65rem', fontWeight: 800 }}>
                        {book.condition}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFFFFF', lineHeight: 1.25 }}>
                        {book.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: book.coverAccent, fontStyle: 'italic', marginTop: '0.2rem' }}>
                        {book.author}
                      </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid rgba(255,255,255,0.25)', paddingTop: '0.45rem' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>{book.edition}</span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-butter-yellow)' }}>
                        ${book.price}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--color-espresso-subtle)' }}>
                      Seller: <strong>{book.sellerName}</strong>
                    </span>
                    <Link to="/discover" className="btn btn-primary btn-sm">
                      View in Discover
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-forest-green)',
        color: '#FAF5E9',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          backgroundColor: 'rgba(246, 231, 161, 0.1)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '680px', position: 'relative', zIndex: 1 }}>
          <Logo size="large" light={true} />
          <h2 style={{
            fontSize: '2.6rem',
            fontFamily: 'var(--font-serif)',
            color: '#FFFFFF',
            margin: '1.5rem 0 1rem'
          }}>
            Ready to find your next chapter?
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#D8CFBF',
            lineHeight: 1.65,
            marginBottom: '2.25rem'
          }}>
            Join fellow students on campus who are saving money, reducing paper waste, and giving second-hand textbooks a second life.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-3d btn-3d-secondary btn-lg">
              Create Student Account
            </Link>
            <Link to="/discover" className="btn btn-3d btn-3d-outline btn-lg" style={{ color: 'var(--color-dark-espresso)' }}>
              Explore Swipe Deck
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
