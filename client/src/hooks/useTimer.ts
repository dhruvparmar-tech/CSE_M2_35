import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';

interface UseTimerOptions {
  initialSeconds?: number;
  onExpiry?: () => void;
  onComplete?: () => void;
}

export const useTimer = (options: UseTimerOptions | number = {}, legacyOnComplete?: () => void) => {
  let initialSeconds: number | undefined;
  let onExpiry: (() => void) | undefined;

  if (typeof options === 'number') {
    initialSeconds = options;
    onExpiry = legacyOnComplete;
  } else {
    initialSeconds = options.initialSeconds;
    onExpiry = options.onExpiry || options.onComplete;
  }

  const { timeRemaining, isRunning, isWarning, isCritical, startTimer, pauseTimer, resetTimer, tick } = useTimerStore();

  useEffect(() => {
    if (initialSeconds && !isRunning) {
      startTimer(initialSeconds);
    }
  }, [initialSeconds, isRunning, startTimer]);

  useEffect(() => {
    let interval: any;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      pauseTimer();
      onExpiry?.();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, tick, pauseTimer, onExpiry]);

  return { timeRemaining, isRunning, isWarning, isCritical, startTimer, pauseTimer, resetTimer };
};

