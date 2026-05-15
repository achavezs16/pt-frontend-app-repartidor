import React, { useState } from 'react';
import './Tooltip.css';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-container">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onTouchStart={() => setIsVisible(true)}
        onTouchEnd={() => setIsVisible(false)}
        className="tooltip-trigger"
      >
        {children}
      </div>

      {isVisible && (
        <>
          <div className={`tooltip-content tooltip-content--${position} ${className}`}>
            <div className="tooltip-inner">
              {content}
              <div className={`tooltip-arrow tooltip-arrow--${position}`} />
            </div>
          </div>
          
          <div
            className="tooltip-overlay"
            onClick={() => setIsVisible(false)}
            onTouchStart={() => setIsVisible(false)}
          />
        </>
      )}
    </div>
  );
};

export const InfoTooltip = ({ content, className = '' }) => (
  <Tooltip content={content} position="top">
    <button
      className={`info-tooltip-btn ${className}`}
      aria-label="Información"
      type="button"
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  </Tooltip>
);

export default Tooltip;
