import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`card-visa p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>
      )}
      {children}
    </div>
  );
}
