import React from 'react';
import { CircularProgress } from '../ui/Progress';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <CircularProgress value={score} size={160} strokeWidth={12}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-4xl font-extrabold text-slate-50">{score}</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Score</span>
          </motion.div>
        </CircularProgress>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-200">Interview Complete!</h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Here is your comprehensive evaluation based on key performance categories.
        </p>
      </div>
    </div>
  );
}
