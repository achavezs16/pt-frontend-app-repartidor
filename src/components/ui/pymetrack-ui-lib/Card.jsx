import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  image, 
  variant = 'default', 
  hoverable = false,
  className,
  actions
}) => {
  const classes = [
    'card',
    variant === 'elevated' && 'card--elevated',
    hoverable && 'card--hoverable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {image && (
        <img
          src={image}
          alt={title || 'Card image'}
          className="card__image"
        />
      )}
      
      <div className="card__content">
        {(title || subtitle) && (
          <div>
            {title && (
              <h3 className="card__title">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="card__subtitle">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="card__body">
          {children}
        </div>
        
        {actions && (
          <div className="card__actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export const CardHeader = ({ title, subtitle, className }) => (
  <div className={`card-header ${className || ''}`}>
    {title && <h3 className="card-header__title">{title}</h3>}
    {subtitle && <p className="card-header__subtitle">{subtitle}</p>}
  </div>
);

export const CardBody = ({ children, className }) => (
  <div className={`card-body ${className || ''}`}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={`card-footer ${className || ''}`}>{children}</div>
);

export default Card;
