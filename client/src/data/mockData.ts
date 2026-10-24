import type { DashboardStats, Interview, InterviewResult, SkillScore } from '../types';

export const mockSkillScores: SkillScore[] = [
  { skill: 'JavaScript', score: 82 },
  { skill: 'React', score: 78 },
  { skill: 'Algorithms', score: 65 },
  { skill: 'Data Structures', score: 70 },
  { skill: 'SQL', score: 60 },
  { skill: 'System Design', score: 55 },
  { skill: 'APIs', score: 85 },
  { skill: 'Problem Solving', score: 72 },
];

export const mockDashboardStats: DashboardStats = {
  interviewsCompleted: 12,
  averageScore: 74,
  bestScore: 92,
  technicalScore: 78,
  recentScores: [
    { date: '2026-07-01', score: 65 },
    { date: '2026-07-08', score: 70 },
    { date: '2026-07-15', score: 68 },
    { date: '2026-07-22', score: 75 },
    { date: '2026-07-29', score: 82 },
    { date: '2026-08-05', score: 78 },
    { date: '2026-08-10', score: 85 },
  ],
  skillRadar: mockSkillScores,
};

export const mockInterviews: Interview[] = [
  {
    id: '1', userId: 'u1',
    config: { role: 'Frontend Developer', experienceLevel: 'Mid Level', difficulty: 'Medium', interviewType: 'Technical Screening', technologies: ['React', 'TypeScript'], topics: ['React', 'JavaScript'], duration: 45, questionCount: 10 },
    status: 'completed', createdAt: '2026-08-09T10:00:00Z', startedAt: '2026-08-09T10:01:00Z', completedAt: '2026-08-09T10:40:00Z', score: 85,
  },
  {
    id: '2', userId: 'u1',
    config: { role: 'Full Stack Developer', experienceLevel: 'Senior', difficulty: 'Hard', interviewType: 'Coding Interview', technologies: ['Node.js', 'TypeScript', 'PostgreSQL'], topics: ['Algorithms', 'Data Structures'], duration: 60, questionCount: 8 },
    status: 'completed', createdAt: '2026-08-07T14:00:00Z', startedAt: '2026-08-07T14:02:00Z', completedAt: '2026-08-07T14:55:00Z', score: 72,
  },
  {
    id: '3', userId: 'u1',
    config: { role: 'Backend Developer', experienceLevel: 'Mid Level', difficulty: 'Medium', interviewType: 'System Design', technologies: ['Node.js', 'AWS', 'Docker'], topics: ['System Design', 'Microservices'], duration: 45, questionCount: 5 },
    status: 'completed', createdAt: '2026-08-05T09:00:00Z', startedAt: '2026-08-05T09:01:00Z', completedAt: '2026-08-05T09:42:00Z', score: 68,
  },
  {
    id: '4', userId: 'u1',
    config: { role: 'Frontend Developer', experienceLevel: 'Junior', difficulty: 'Easy', interviewType: 'Frontend', technologies: ['React', 'JavaScript', 'CSS'], topics: ['React', 'JavaScript', 'Performance'], duration: 30, questionCount: 10 },
    status: 'completed', createdAt: '2026-08-02T11:00:00Z', startedAt: '2026-08-02T11:00:30Z', completedAt: '2026-08-02T11:28:00Z', score: 92,
  },
  {
    id: '5', userId: 'u1',
    config: { role: 'DevOps Engineer', experienceLevel: 'Senior', difficulty: 'Hard', interviewType: 'Backend', technologies: ['Docker', 'Kubernetes', 'AWS'], topics: ['CI/CD', 'Cloud Architecture'], duration: 45, questionCount: 10 },
    status: 'completed', createdAt: '2026-07-30T16:00:00Z', startedAt: '2026-07-30T16:01:00Z', completedAt: '2026-07-30T16:44:00Z', score: 60,
  },
];

export const mockInterviewResult: InterviewResult = {
  id: 'r1',
  interviewId: '1',
  overallScore: 85,
  skillScores: [
    { skill: 'Technical Knowledge', score: 88 },
    { skill: 'Problem Solving', score: 82 },
    { skill: 'Coding', score: 80 },
    { skill: 'Communication', score: 90 },
    { skill: 'Accuracy', score: 85 },
  ],
  summary: 'Strong performance across React fundamentals and component architecture. Demonstrated solid understanding of hooks, state management, and performance optimization. Could improve on advanced patterns like render optimization and concurrent features.',
  strengths: [
    'Strong JavaScript fundamentals',
    'Excellent understanding of React hooks and lifecycle',
    'Good communication of technical concepts',
    'Correct complexity analysis for algorithms',
    'Clean, readable code submissions',
  ],
  weaknesses: [
    'Could improve on advanced React patterns (Suspense, Concurrent)',
    'Async JavaScript needs more depth (Promises, event loop)',
    'Edge-case handling in coding solutions',
    'System design scalability considerations',
  ],
  recommendations: [
    'Practice advanced React patterns: Suspense, Error Boundaries, Concurrent Mode',
    'Deep dive into the JavaScript event loop and async patterns',
    'Work on edge-case identification in algorithm problems',
    'Study system design fundamentals: load balancing, caching, database sharding',
  ],
  evaluations: {},
};
