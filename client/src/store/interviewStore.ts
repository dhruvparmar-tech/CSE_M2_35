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
      await interviewApi.submitAnswer(id, { questionId: 'current', content: answer, code });
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
