import { fetchApi } from './apiClient';
import { PracticeQuestion } from '@/types';

export const practiceApi = {
  generatePractice: (category: string, difficulty: string, count: number): Promise<PracticeQuestion[]> => 
    fetchApi('/practice/generate', { method: 'POST', body: JSON.stringify({ category, difficulty, count }) }),
  getPractice: (): Promise<PracticeQuestion[]> => fetchApi('/practice', { method: 'GET' }),
  submitPracticeAnswer: (id: string, answer: string): Promise<any> => 
    fetchApi(`/practice/${id}/answer`, { method: 'POST', body: JSON.stringify({ answer }) }),
};
