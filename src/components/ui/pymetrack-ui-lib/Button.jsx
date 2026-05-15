import React from 'react';
import './Button.css';

const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}, ref) => {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon && !loading) return null;
    
    if (loading) {
      return (
        <svg className="button__icon button__loading" width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
          <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }
    
    return <span className={`button__icon ${iconPosition === 'right' ? 'button__icon--right' : ''}`}>{icon}</span>;
  };

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
