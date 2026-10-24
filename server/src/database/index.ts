import { prisma } from './prismaClient.js';
import { inMemoryDb } from './inMemoryDb.js';
import { logger } from '../utils/logger.js';

let usePrisma = false;

if (process.env.DATABASE_URL) {
  usePrisma = true;
  logger.info('Using Prisma database');
} else {
  logger.info('Using in-memory database');
}

export const db = {
  user: {
    create: async (data: any) => usePrisma ? prisma.user.create(data) : inMemoryDb.createUser(data.data),
    findUnique: async (args: any) => {
      if (usePrisma) return prisma.user.findUnique(args);
      if (args.where.id) return inMemoryDb.findUserById(args.where.id);
      if (args.where.email) return inMemoryDb.findUserByEmail(args.where.email);
      return null;
    }
  },
  interview: {
    create: async (data: any) => usePrisma ? prisma.interview.create(data) : inMemoryDb.createInterview(data.data),
    findUnique: async (args: any) => usePrisma ? prisma.interview.findUnique(args) : inMemoryDb.findInterviewById(args.where.id),
    findMany: async (args: any) => usePrisma ? prisma.interview.findMany(args) : inMemoryDb.findInterviewsByUserId(args.where.userId),
    update: async (args: any) => usePrisma ? prisma.interview.update(args) : inMemoryDb.updateInterview(args.where.id, args.data)
  },
  interviewQuestion: {
    create: async (data: any) => usePrisma ? prisma.interviewQuestion.create(data) : inMemoryDb.createInterviewQuestion(data.data),
    findUnique: async (args: any) => usePrisma ? prisma.interviewQuestion.findUnique(args) : inMemoryDb.interviewQuestions.get(args.where.id),
    findMany: async (args: any) => {
      if (usePrisma) return prisma.interviewQuestion.findMany(args);
      const results = [];
      for (const q of inMemoryDb.interviewQuestions.values()) {
        if (q.interviewId === args.where.interviewId) results.push(q);
      }
      return results.sort((a, b) => a.questionNumber - b.questionNumber);
    }
  },
  candidateAnswer: {
    create: async (data: any) => usePrisma ? prisma.candidateAnswer.create(data) : inMemoryDb.createCandidateAnswer(data.data),
    findMany: async (args: any) => {
      if (usePrisma) return prisma.candidateAnswer.findMany(args);
      const results = [];
      const questionId = args.where.questionId;
      if (questionId && typeof questionId === 'string') {
        for (const a of inMemoryDb.candidateAnswers.values()) {
          if (a.questionId === questionId) results.push(a);
        }
      } else if (questionId && questionId.in) {
        for (const a of inMemoryDb.candidateAnswers.values()) {
          if (questionId.in.includes(a.questionId)) results.push(a);
        }
      }
      return results;
    }
  },
  interviewResult: {
    create: async (data: any) => usePrisma ? prisma.interviewResult.create(data) : inMemoryDb.createInterviewResult(data.data),
    findUnique: async (args: any) => {
      if (usePrisma) return prisma.interviewResult.findUnique(args);
      for (const r of inMemoryDb.interviewResults.values()) {
        if (r.interviewId === args.where.interviewId) return r;
      }
      return null;
    }
  },
  practiceQuestion: {
    create: async (data: any) => usePrisma ? prisma.practiceQuestion.create(data) : inMemoryDb.createPracticeQuestion(data.data),
    findUnique: async (args: any) => usePrisma ? prisma.practiceQuestion.findUnique(args) : inMemoryDb.practiceQuestions.get(args.where.id),
    update: async (args: any) => {
      if (usePrisma) return prisma.practiceQuestion.update(args);
      const q = inMemoryDb.practiceQuestions.get(args.where.id);
      if (!q) throw new Error('Practice question not found');
      const updated = { ...q, ...args.data };
      inMemoryDb.practiceQuestions.set(args.where.id, updated);
      return updated;
    },
    findMany: async (args: any) => {
      if (usePrisma) return prisma.practiceQuestion.findMany(args);
      const results = [];
      for (const q of inMemoryDb.practiceQuestions.values()) {
        if (q.userId === args.where.userId) results.push(q);
      }
      return results;
    }
  }
};
