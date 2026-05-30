import React from 'react';
import './Logo.css';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  return (
    <div className={`pymetrack-logo pymetrack-logo--${size} ${className}`}>
      <div className="pymetrack-logo__icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 11H17L21 15V20H19C19 21.6569 17.6569 23 16 23C14.3431 23 13 21.6569 13 20H9C9 21.6569 7.65685 23 6 23C4.34315 23 3 21.6569 3 20H1V11Z" fill="currentColor"/>
          <path d="M17 11L13 4H3V11H17Z" fill="currentColor" opacity="0.8"/>
          <circle cx="6" cy="20" r="1.5" fill="white"/>
          <circle cx="16" cy="20" r="1.5" fill="white"/>
        </svg>
      </div>
      {showText && (
        <span className="pymetrack-logo__text">
          Pyme<span className="pymetrack-logo__text--accent">track</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
