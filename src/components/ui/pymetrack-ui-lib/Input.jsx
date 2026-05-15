import React from 'react';
import './Input.css';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(36).substr(2, 9)}`;

  const classes = [
    'input-field',
    `input-field--${variant}`,
    `input-field--${size}`,
    fullWidth && 'input-field--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-wrapper--full-width' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        ref={ref}
        className={classes}
        {...props}
      />
      
      {error && (
        <p className="input-message input-message--error">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="input-message input-message--helper">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
