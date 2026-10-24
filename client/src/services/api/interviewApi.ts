import { fetchApi } from './apiClient';
import { Interview, InterviewConfig, InterviewResult, FollowUpResponse } from '@/types';

export const interviewApi = {
  createInterview: (config: InterviewConfig): Promise<Interview> => 
    fetchApi('/interviews', { method: 'POST', body: JSON.stringify(config) }),
    
  getInterviews: (): Promise<Interview[]> => fetchApi('/interviews', { method: 'GET' }),
  getInterview: (id: string): Promise<Interview> => fetchApi(`/interviews/${id}`, { method: 'GET' }),
  startInterview: (id: string): Promise<Interview> => fetchApi(`/interviews/${id}/start`, { method: 'POST' }),
  submitAnswer: (id: string, payload: { questionId: string; content: string; code?: string; language?: string }): Promise<any> => 
    fetchApi(`/interviews/${id}/answer`, { method: 'POST', body: JSON.stringify(payload) }),
  getFollowUp: (id: string): Promise<FollowUpResponse> => fetchApi(`/interviews/${id}/followup`, { method: 'GET' }),
  completeInterview: (id: string): Promise<InterviewResult> => fetchApi(`/interviews/${id}/complete`, { method: 'POST' }),
  getResults: (id: string): Promise<InterviewResult> => fetchApi(`/interviews/${id}/results`, { method: 'GET' }),
};
