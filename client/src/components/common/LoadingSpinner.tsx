import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'md', label, className, fullScreen }: LoadingSpinnerProps) {
  const s = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-10 w-10' : 'h-6 w-6';
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-indigo-400', s)} />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
  if (fullScreen) {
    return <div className="flex h-screen w-full items-center justify-center bg-slate-950">{spinner}</div>;
  }
  return spinner;
}
