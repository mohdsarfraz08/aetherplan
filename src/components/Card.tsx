import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', ...rest }) => {
  return (
    <div className={`card p-4 ${className}`} {...rest}>
      {title && <div className="mb-3 text-sm text-[var(--text-muted)] font-medium">{title}</div>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
