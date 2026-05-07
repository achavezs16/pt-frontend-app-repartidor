'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top', 
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 transform -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 transform -translate-y-1/2 -mr-1',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onTouchStart={() => setIsVisible(true)}
        onTouchEnd={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>

      {isVisible && (
        <>
          <div
            className={cn(
              'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-lg max-w-xs',
              'animate-in fade-in-0 zoom-in-95 duration-200',
              positionClasses[position],
              className
            )}
          >
            <div className="relative">
              {content}
              <div
                className={cn(
                  'absolute w-2 h-2 bg-gray-900 transform rotate-45',
                  arrowClasses[position]
                )}
              />
            </div>
          </div>
          
          {/* Overlay para cerrar en dispositivos móviles */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsVisible(false)}
            onTouchStart={() => setIsVisible(false)}
          />
        </>
      )}
    </div>
  );
};

// Componente de ícono de información con tooltip
export const InfoTooltip: React.FC<{ content: string; className?: string }> = ({ 
  content, 
  className 
}) => {
  return (
    <Tooltip content={content} position="top">
      <button
        className={cn(
          'inline-flex items-center justify-center w-6 h-6 text-gray-400 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          className
        )}
        aria-label="Información"
      >
        <svg
          className="w-4 h-4"
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
};

export default Tooltip;
