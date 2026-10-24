export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  targetRole?: string;
  experienceLevel?: string;
  technologies?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface InterviewConfig {
  role: string;
  experienceLevel: string;
  difficulty: string;
  interviewType: string;
  technologies: string[];
  topics: string[];
  duration: number;
  questionCount: number;
}

export interface Interview {
  id: string;
  userId: string;
  config: InterviewConfig;
  status: 'pending' | 'in_progress' | 'completed' | 'active';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  currentQuestion?: number;
  questions?: InterviewQuestion[];
  answers?: CandidateAnswer[];
  currentQuestionDetail?: InterviewQuestion;
}

export interface InterviewMessage {
  id: string;
  role: 'ai' | 'candidate';
  content: string;
  timestamp: string;
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'coding' | 'system-design';
  content: string;
  question: string; // alias/fallback
  topics: string[];
  expectedSkills: string[];
  difficulty: string;
  codeTemplate?: string;
  codeLanguage?: string;
}

export interface CandidateAnswer {
  questionId: string;
  content: string;
  code?: string;
  language?: string;
}

export interface QuestionEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
}

export interface CodingEvaluation extends QuestionEvaluation {
  executionResult?: {
    passed: boolean;
    output: string;
    error?: string;
  };
}

export interface SkillScore {
  skill: string;
  score: number;
}

export interface InterviewResult {
  id: string;
  interviewId: string;
  overallScore: number;
  skillScores: SkillScore[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  evaluations: Record<string, QuestionEvaluation | CodingEvaluation>;
}

export interface PracticeQuestion {
  id: string;
  category: string;
  difficulty: string;
  content: string;
  type: 'technical' | 'coding';
}

export interface FollowUpResponse {
  message: string;
  isComplete: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface DashboardStats {
  interviewsCompleted: number;
  averageScore: number;
  bestScore: number;
  technicalScore: number;
  recentScores: { date: string; score: number }[];
  skillRadar: SkillScore[];
}
