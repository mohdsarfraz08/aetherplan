import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-0.5">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">{actions}</div>
    </div>
  );
};

export default PageHeader;
