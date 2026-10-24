import { create } from 'zustand';

interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isWarning: boolean;
  isCritical: boolean;
  startTimer: (durationSeconds: number) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  timeRemaining: 0,
  isRunning: false,
  isWarning: false,
  isCritical: false,

  startTimer: (durationSeconds) => {
    set({ 
      timeRemaining: durationSeconds, 
      isRunning: true,
      isWarning: durationSeconds <= 300,
      isCritical: durationSeconds <= 60
    });
  },
  
  pauseTimer: () => set({ isRunning: false }),
  
  resetTimer: () => set({ timeRemaining: 0, isRunning: false, isWarning: false, isCritical: false }),
  
  tick: () => {
    const { timeRemaining, isRunning } = get();
    if (!isRunning || timeRemaining <= 0) return;
    
    const newTime = timeRemaining - 1;
    set({
      timeRemaining: newTime,
      isWarning: newTime > 60 && newTime <= 300,
      isCritical: newTime <= 60,
      isRunning: newTime > 0
    });
  }
}));
