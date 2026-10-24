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
