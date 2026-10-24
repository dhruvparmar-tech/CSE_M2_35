const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  const fullPath = path.join(__dirname, 'client/src', file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n');
};

write('services/api/apiClient.ts', `
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = \`Bearer \${token}\`;
  }

  const response = await fetch(\`\${API_BASE_URL}\${endpoint}\`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
}
`);

write('services/api/authApi.ts', `
import { fetchApi } from './apiClient';
import { AuthResponse, User } from '@/types';

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> => 
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    
  signup: (email: string, password: string, name: string): Promise<AuthResponse> => 
    fetchApi('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
    
  getMe: (): Promise<User> => fetchApi('/auth/me', { method: 'GET' }),
};
`);

write('services/api/interviewApi.ts', `
import { fetchApi } from './apiClient';
import { Interview, InterviewConfig, InterviewResult, FollowUpResponse } from '@/types';

export const interviewApi = {
  createInterview: (config: InterviewConfig): Promise<Interview> => 
    fetchApi('/interviews', { method: 'POST', body: JSON.stringify(config) }),
    
  getInterviews: (): Promise<Interview[]> => fetchApi('/interviews', { method: 'GET' }),
  getInterview: (id: string): Promise<Interview> => fetchApi(\`/interviews/\${id}\`, { method: 'GET' }),
  startInterview: (id: string): Promise<Interview> => fetchApi(\`/interviews/\${id}/start\`, { method: 'POST' }),
  submitAnswer: (id: string, answer: string, code?: string): Promise<void> => 
    fetchApi(\`/interviews/\${id}/answers\`, { method: 'POST', body: JSON.stringify({ answer, code }) }),
  getFollowUp: (id: string): Promise<FollowUpResponse> => fetchApi(\`/interviews/\${id}/followup\`, { method: 'GET' }),
  completeInterview: (id: string): Promise<InterviewResult> => fetchApi(\`/interviews/\${id}/complete\`, { method: 'POST' }),
  getResults: (id: string): Promise<InterviewResult> => fetchApi(\`/interviews/\${id}/results\`, { method: 'GET' }),
};
`);

write('services/api/codeApi.ts', `
import { fetchApi } from './apiClient';

export const codeApi = {
  runCode: (code: string, language: string, testCases?: any[]) => 
    fetchApi('/code/run', { method: 'POST', body: JSON.stringify({ code, language, testCases }) }),
  submitCode: (code: string, language: string, problemId: string) => 
    fetchApi('/code/submit', { method: 'POST', body: JSON.stringify({ code, language, problemId }) }),
};
`);

write('services/api/practiceApi.ts', `
import { fetchApi } from './apiClient';
import { PracticeQuestion } from '@/types';

export const practiceApi = {
  generatePractice: (category: string, difficulty: string, count: number): Promise<PracticeQuestion[]> => 
    fetchApi('/practice/generate', { method: 'POST', body: JSON.stringify({ category, difficulty, count }) }),
  getPractice: (): Promise<PracticeQuestion[]> => fetchApi('/practice', { method: 'GET' }),
};
`);

write('services/api/profileApi.ts', `
import { fetchApi } from './apiClient';
import { User } from '@/types';

export const profileApi = {
  getProfile: (): Promise<User> => fetchApi('/profile', { method: 'GET' }),
  updateProfile: (data: Partial<User>): Promise<User> => fetchApi('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};
`);

write('store/authStore.ts', `
import { create } from 'zustand';
import { User } from '@/types';
import { authApi } from '@/services/api/authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authApi.login(email, password);
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  signup: async (email, password, name) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authApi.signup(email, password, name);
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
`);

write('store/interviewStore.ts', `
import { create } from 'zustand';
import { Interview, InterviewQuestion, InterviewMessage, InterviewConfig, InterviewResult } from '@/types';
import { interviewApi } from '@/services/api/interviewApi';

interface InterviewState {
  currentInterview: Interview | null;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  messages: InterviewMessage[];
  isAIThinking: boolean;
  createInterview: (config: InterviewConfig) => Promise<Interview>;
  startInterview: (id: string) => Promise<void>;
  submitAnswer: (id: string, answer: string, code?: string) => Promise<void>;
  requestFollowUp: (id: string) => Promise<void>;
  completeInterview: (id: string) => Promise<InterviewResult>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  currentInterview: null,
  questions: [],
  currentQuestionIndex: 0,
  messages: [],
  isAIThinking: false,

  createInterview: async (config) => {
    const interview = await interviewApi.createInterview(config);
    set({ currentInterview: interview });
    return interview;
  },

  startInterview: async (id) => {
    const interview = await interviewApi.startInterview(id);
    set({ currentInterview: interview, messages: [], currentQuestionIndex: 0 });
  },

  submitAnswer: async (id, answer, code) => {
    set({ isAIThinking: true });
    try {
      await interviewApi.submitAnswer(id, answer, code);
      // Mock progression for now
      set((state) => ({ 
        messages: [...state.messages, { id: Date.now().toString(), role: 'candidate', content: answer, timestamp: new Date().toISOString() }],
        isAIThinking: false 
      }));
    } catch (e) {
      set({ isAIThinking: false });
      throw e;
    }
  },

  requestFollowUp: async (id) => {
    set({ isAIThinking: true });
    try {
      const response = await interviewApi.getFollowUp(id);
      set((state) => ({
        messages: [...state.messages, { id: Date.now().toString(), role: 'ai', content: response.message, timestamp: new Date().toISOString() }],
        isAIThinking: false
      }));
    } catch(e) {
      set({ isAIThinking: false });
      throw e;
    }
  },

  completeInterview: async (id) => {
    const result = await interviewApi.completeInterview(id);
    set({ currentInterview: null, messages: [], questions: [], currentQuestionIndex: 0 });
    return result;
  }
}));
`);

write('store/uiStore.ts', `
import { create } from 'zustand';

interface UiState {
  theme: 'dark' | 'light' | 'system';
  sidebarOpen: boolean;
  notifications: any[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  theme: 'dark',
  sidebarOpen: false,
  notifications: [],
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
`);

write('store/timerStore.ts', `
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
`);

write('hooks/useTimer.ts', `
import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';

export const useTimer = (initialSeconds?: number, onComplete?: () => void) => {
  const { timeRemaining, isRunning, isWarning, isCritical, startTimer, pauseTimer, resetTimer, tick } = useTimerStore();

  useEffect(() => {
    if (initialSeconds && !isRunning) {
      startTimer(initialSeconds);
    }
  }, [initialSeconds, isRunning, startTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      pauseTimer();
      onComplete?.();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, tick, pauseTimer, onComplete]);

  return { timeRemaining, isRunning, isWarning, isCritical, startTimer, pauseTimer, resetTimer };
};
`);

write('hooks/useInterview.ts', `
import { useInterviewStore } from '@/store/interviewStore';

export const useInterview = () => {
  const store = useInterviewStore();
  
  const isLastQuestion = store.currentQuestionIndex === store.questions.length - 1;
  const progress = store.questions.length > 0 ? ((store.currentQuestionIndex + 1) / store.questions.length) * 100 : 0;
  
  return {
    ...store,
    isLastQuestion,
    progress
  };
};
`);

write('hooks/useAuth.ts', `
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const useAuth = (requireAuth = true) => {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, requireAuth, isAuthenticated, navigate]);

  return { isAuthenticated, isLoading, user };
};
`);

write('hooks/useMediaQuery.ts', `
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};
`);

write('lib/utils.ts', `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`);
