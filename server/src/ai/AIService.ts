import { 
  InterviewQuestion, 
  AnswerEvaluation, 
  FollowUpResponse, 
  CodingEvaluation, 
  InterviewResultResponse 
} from '../types/index.js';

export interface QuestionContext {
  role: string;
  experienceLevel: string;
  difficulty: string;
  technologies: string[];
  topic: string;
}

export interface FollowUpContext {
  originalQuestion: string;
  candidateAnswer: string;
  interviewContext: any[];
}

export interface EvaluationContext {
  question: string;
  answer: string;
  expectedSkills: string[];
  context: any[];
}

export interface CodingEvaluationContext {
  problem: string;
  code: string;
  language: string;
  testResults: any[];
}

export interface ResultContext {
  history: any[];
}

export interface PracticeContext {
  category: string;
  difficulty: string;
  count: number;
}

export interface PracticeQuestionResponse {
  question: string;
  hints: string[];
  solution: string;
}

export interface AIService {
  generateInterviewQuestion(context: QuestionContext): Promise<InterviewQuestion>;
  generateFollowUpQuestion(context: FollowUpContext): Promise<FollowUpResponse>;
  evaluateAnswer(context: EvaluationContext): Promise<AnswerEvaluation>;
  evaluateCodingAnswer(context: CodingEvaluationContext): Promise<CodingEvaluation>;
  generateInterviewResult(context: ResultContext): Promise<InterviewResultResponse>;
  generatePracticeQuestions(context: PracticeContext): Promise<PracticeQuestionResponse[]>;
}
