import React from 'react';
import { Timer as Clock } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

interface InterviewTimerProps {
  timeRemaining: number;
  isWarning: boolean;
  isCritical: boolean;
}

export function InterviewTimer({ timeRemaining, isWarning, isCritical }: InterviewTimerProps) {
  const color = isCritical
    ? 'text-rose-500 animate-pulse border-rose-500/30 bg-rose-500/10'
    : isWarning
    ? 'text-amber-500 border-amber-500/30 bg-amber-500/10'
    : 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';

  return (
    <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-sm font-semibold transition-all duration-300 ${color}`}>
      <Clock className="h-4 w-4" />
      <span>{formatDuration(timeRemaining)}</span>
    </div>
  );
}
