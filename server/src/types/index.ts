import { z } from 'zod';

export const InterviewConfigSchema = z.object({
  role: z.string(),
  experienceLevel: z.string(),
  difficulty: z.string(),
  interviewType: z.string(),
  technologies: z.array(z.string()),
  topics: z.array(z.string()),
  duration: z.number(),
  questionCount: z.number()
});

export type InterviewConfig = z.infer<typeof InterviewConfigSchema>;

export const InterviewQuestionSchema = z.object({
  question: z.string(),
  type: z.enum(['technical', 'coding', 'system-design']).default('technical'),
  topic: z.string().default('general'),
  difficulty: z.string().default('medium'),
  expectedSkills: z.array(z.string()).default([]),
  codeTemplate: z.string().optional().default(''),
  testCases: z.array(z.string()).optional().default([])
});

export type InterviewQuestion = z.infer<typeof InterviewQuestionSchema>;

export const AnswerEvaluationSchema = z.object({
  score: z.number().default(0),
  technicalAccuracy: z.number().default(0),
  depth: z.number().default(0),
  problemSolving: z.number().default(0),
  communication: z.number().default(0),
  feedback: z.string().default('No feedback provided.'),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  shouldAskFollowUp: z.boolean().default(false)
});

export type AnswerEvaluation = z.infer<typeof AnswerEvaluationSchema>;

export const FollowUpResponseSchema = z.object({
  shouldAskFollowUp: z.boolean().default(false),
  followUpQuestion: z.string().optional().default(''),
  reason: z.string().default('Proceeding to next question.')
});

export type FollowUpResponse = z.infer<typeof FollowUpResponseSchema>;

export const CodingEvaluationSchema = z.object({
  score: z.number(),
  correctness: z.number(),
  algorithm: z.number(),
  codeQuality: z.number(),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string())
});

export type CodingEvaluation = z.infer<typeof CodingEvaluationSchema>;

export const InterviewResultSchema = z.object({
  overallScore: z.number(),
  technicalKnowledge: z.number(),
  problemSolving: z.number(),
  coding: z.number(),
  communication: z.number(),
  accuracy: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
  summary: z.string()
});

export type InterviewResultResponse = z.infer<typeof InterviewResultSchema>;

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string()
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});
