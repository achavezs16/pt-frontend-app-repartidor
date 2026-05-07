'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, icon, fullWidth = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    
    const variantClasses = {
      primary: 'bg-blue-600 text-white focus:ring-blue-500 hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-900 focus:ring-gray-500 hover:bg-gray-300',
      danger: 'bg-red-600 text-white focus:ring-red-500 hover:bg-red-700',
      success: 'bg-green-600 text-white focus:ring-green-500 hover:bg-green-700',
      outline: 'border-2 border-gray-300 text-gray-700 focus:ring-gray-500 hover:bg-gray-50',
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[44px]', // Mínimo 44px para accesibilidad táctil
      md: 'px-4 py-3 text-base min-h-[48px]', // Mínimo 48px para mejor experiencia táctil
      lg: 'px-6 py-4 text-lg min-h-[52px]', // Extra grande para fácil acceso
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
