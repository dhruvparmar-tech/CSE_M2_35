import { fetchApi } from './apiClient';

export const codeApi = {
  runCode: (code: string, language: string, testCases?: any[]) => 
    fetchApi('/code/run', { method: 'POST', body: JSON.stringify({ code, language, testCases }) }),
  submitCode: (code: string, language: string, problemId: string) => 
    fetchApi('/code/submit', { method: 'POST', body: JSON.stringify({ code, language, problemId }) }),
};
