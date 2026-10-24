import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'info' | 'warning' | 'error' | 'success';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-indigo-600/20 text-indigo-400": variant === 'default',
          "border-transparent bg-slate-800 text-slate-105": variant === 'secondary',
          "text-slate-100 border-slate-700": variant === 'outline',
          "border-transparent bg-rose-900/30 text-rose-400": variant === 'destructive' || variant === 'error',
          "border-transparent bg-blue-900/30 text-blue-400": variant === 'info',
          "border-transparent bg-amber-900/30 text-amber-400": variant === 'warning',
          "border-transparent bg-emerald-950 text-emerald-400": variant === 'success',
        },
        className
      )}
      {...props}
    />
  );
}
