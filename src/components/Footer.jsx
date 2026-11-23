import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-dark-espresso)',
      color: '#FAF5E9',
      paddingTop: '3.5rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto',
      borderTop: '3px solid var(--color-forest-green)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Column */}
          <div style={{ maxWidth: '340px' }}>
            <Logo size="medium" light={true} linkTo="/" />
            <p style={{
              marginTop: '1rem',
              fontSize: '0.88rem',
              color: '#D8CFBF',
              lineHeight: 1.6
            }}>
              ReLeaf gives textbooks a second life by connecting students who have books with students who need them.
            </p>
            <p style={{
              marginTop: '0.75rem',
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              color: 'var(--color-butter-yellow)',
              fontSize: '0.95rem'
            }}>
              "One Book. Many Stories."
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 style={{
              color: 'var(--color-butter-yellow)',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              marginBottom: '1rem'
            }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><Link to="/discover" style={{ color: '#D8CFBF' }}>Book Discovery (Swipe)</Link></li>
              <li><Link to="/available" style={{ color: '#D8CFBF' }}>Available Textbooks</Link></li>
              <li><Link to="/wanted" style={{ color: '#D8CFBF' }}>Wanted Book Requests</Link></li>
              <li><Link to="/add-book" style={{ color: '#D8CFBF' }}>List a Book (I Have / I Want)</Link></li>
              <li><Link to="/matches" style={{ color: '#D8CFBF' }}>My Matches</Link></li>
            </ul>
          </div>

          {/* Academic Community */}
          <div>
            <h4 style={{
              color: 'var(--color-butter-yellow)',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              marginBottom: '1rem'
            }}>
              Campus Exchange
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
              <li><span style={{ color: '#D8CFBF' }}>Central Library Pickup Zones</span></li>
              <li><span style={{ color: '#D8CFBF' }}>Student Union Book Drop</span></li>
              <li><span style={{ color: '#D8CFBF' }}>Campus Exchange Safety Guidelines</span></li>
              <li><span style={{ color: '#D8CFBF' }}>Textbook Condition Guide</span></li>
            </ul>
          </div>

          {/* Sustainability & Impact */}
          <div>
            <h4 style={{
              color: 'var(--color-butter-yellow)',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              marginBottom: '1rem'
            }}>
              Green Campus Impact
            </h4>
            <div style={{
              backgroundColor: 'rgba(52, 78, 65, 0.45)',
              border: '1px solid rgba(246, 231, 161, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '0.84rem',
              color: '#D8CFBF'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>
                🌱 Every recycled textbook saves <strong style={{ color: 'var(--color-butter-yellow)' }}>2.4 kg CO₂</strong> and keeps academic costs affordable for fellow students.
              </p>
              <span style={{ fontSize: '0.76rem', color: '#B7CEBF' }}>
                Designed for University Students.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(250, 245, 233, 0.12)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#A99F91'
        }}>
          <div>
            &copy; {new Date().getFullYear()} ReLeaf. All rights reserved. Give Books a New Chapter.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Student Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
