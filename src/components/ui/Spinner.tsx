import React from 'react';
import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'primary' | 'slate';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const colors = {
    white: 'border-white/30 border-t-white',
    primary: 'border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400',
    slate: 'border-slate-300 dark:border-slate-700 border-t-slate-700 dark:border-t-slate-200',
  };

  return (
    <div
      className={clsx(
        'rounded-full animate-spin',
        sizes[size],
        colors[color],
        className
      )}
    />
  );
};
