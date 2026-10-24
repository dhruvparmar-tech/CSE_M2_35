import React from 'react';

export function AudioWaveform() {
  return (
    <div className="flex items-center gap-0.5 h-4">
      <span className="w-0.5 bg-indigo-500 rounded-full h-2 animate-pulse" style={{ animationDelay: '0ms' }} />
      <span className="w-0.5 bg-indigo-500 rounded-full h-4 animate-pulse" style={{ animationDelay: '150ms' }} />
      <span className="w-0.5 bg-indigo-500 rounded-full h-1 animate-pulse" style={{ animationDelay: '300ms' }} />
      <span className="w-0.5 bg-indigo-500 rounded-full h-3 animate-pulse" style={{ animationDelay: '450ms' }} />
      <span className="w-0.5 bg-indigo-500 rounded-full h-2 animate-pulse" style={{ animationDelay: '600ms' }} />
    </div>
  );
}
export default AudioWaveform;
