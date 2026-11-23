import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ size = 'medium', withTagline = false, light = false, linkTo = '/' }) {
  // Size variations
  const dimensions = {
    small: { icon: 26, titleSize: '1.25rem', leafScale: 0.8 },
    medium: { icon: 34, titleSize: '1.6rem', leafScale: 1 },
    large: { icon: 48, titleSize: '2.4rem', leafScale: 1.35 },
    hero: { icon: 60, titleSize: '3.2rem', leafScale: 1.6 }
  }[size] || { icon: 34, titleSize: '1.6rem', leafScale: 1 };

  const primaryColor = light ? '#FAF5E9' : '#344E41';
  const leafColor = light ? '#F6E7A1' : '#344E41';
  const pageFill = light ? 'rgba(250, 245, 233, 0.15)' : '#FAF5E9';
  const accentLeaf = light ? '#FAF5E9' : '#D96C55';

  const content = (
    <div className={`releaf-logo releaf-logo-${size} ${light ? 'releaf-logo-light' : ''}`} style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: size === 'large' || size === 'hero' ? '0.85rem' : '0.6rem',
      textDecoration: 'none'
    }}>
      {/* Botanical Book Emblem */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Soft Background Pill Glow */}
        <circle cx="24" cy="24" r="23" fill={light ? 'rgba(255,255,255,0.08)' : '#F6E7A1'} fillOpacity={light ? '0.1' : '0.3'} />

        {/* Open Book Pages */}
        {/* Left Page */}
        <path
          d="M10 33C14 31 19 31.5 24 34V15.5C19 13.5 14 13.8 10 16V33Z"
          fill={pageFill}
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Right Page */}
        <path
          d="M38 33C34 31 29 31.5 24 34V15.5C29 13.5 34 13.8 38 16V33Z"
          fill={pageFill}
          stroke={primaryColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Center Spine */}
        <line x1="24" y1="15" x2="24" y2="34" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />

        {/* Subtle Page Lines */}
        <path d="M14 21C17 20 20 20.2 22 21" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M14 25C17 24 20 24.2 22 25" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M26 21C28 20.2 31 20 34 21" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M26 25C28 24.2 31 24 34 25" stroke={primaryColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

        {/* Sprouting Botanical Stem & Leaves from Book Center */}
        {/* Main curved seedling stem */}
        <path
          d="M24 15.5C23.5 12 25 9 27 6.5"
          stroke={leafColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Left tender leaf */}
        <path
          d="M24 12C20.5 11 19 8.5 20.5 6C23 6 24 9.5 24 12Z"
          fill={leafColor}
          stroke={leafColor}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Right sprouting leaf with sprout tip */}
        <path
          d="M26 9.5C29 8.5 31.5 10 31 12.5C28.5 13 26.5 11 26 9.5Z"
          fill={accentLeaf}
          stroke={accentLeaf}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Tiny golden seed bud */}
        <circle cx="27" cy="6.5" r="1.5" fill="#F6E7A1" />
      </svg>

      {/* Brand Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: dimensions.titleSize,
          fontWeight: 700,
          color: primaryColor,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'baseline'
        }}>
          Re<span style={{ color: light ? '#F6E7A1' : '#344E41', fontStyle: 'italic', fontWeight: 600 }}>Leaf</span>
        </span>
        {withTagline && (
          <span style={{
            fontSize: size === 'hero' ? '1rem' : '0.72rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500,
            color: light ? '#FAF5E9' : '#5C5247',
            letterSpacing: '0.04em',
            marginTop: '0.2rem',
            opacity: 0.9
          }}>
            Give Books a New Chapter
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}
