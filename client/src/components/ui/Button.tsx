import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'danger' | 'primary' | 'secondary' | 'success' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm': variant === 'default' || variant === 'primary',
            'border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100': variant === 'outline',
            'hover:bg-slate-800 text-slate-200': variant === 'ghost',
            'text-indigo-400 hover:text-indigo-300 underline-offset-4 hover:underline': variant === 'link',
            'bg-rose-600/20 text-rose-500 hover:bg-rose-600/30 border border-rose-600/50': variant === 'danger' || variant === 'destructive',
            'bg-slate-800 hover:bg-slate-700 text-slate-200': variant === 'secondary',
            'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm': variant === 'success',
            'h-9 px-3': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
