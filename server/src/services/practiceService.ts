import { aiService } from '../ai/index.js';
import { db } from '../database/index.js';

export const practiceService = {
  async generatePractice(userId: string, category: string, difficulty: string, count: number) {
    const rawQuestions = await aiService.generatePracticeQuestions({ category, difficulty, count });
    
    const savedQuestions = [];
    for (const q of rawQuestions) {
      const created = await db.practiceQuestion.create({
        data: {
          userId,
          category,
          difficulty,
          question: q.question,
          answer: null,
          explanation: q.solution,
          hints: q.hints || [],
          tags: [category],
          completed: false,
          score: null
        }
      });
      savedQuestions.push(created);
    }

    // Map DB structures to client-expected PracticeQuestion structure
    return savedQuestions.map((q: any) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      content: q.question,
      type: 'technical' as const
    }));
  },

  async getPractice(userId: string) {
    const list = await db.practiceQuestion.findMany({ where: { userId } });
    return list.map((q: any) => ({
      id: q.id,
      category: q.category,
      difficulty: q.difficulty,
      content: q.question,
      type: 'technical' as const
    }));
  },

  async submitPracticeAnswer(id: string, answer: string) {
    const q = await db.practiceQuestion.findUnique({ where: { id } });
    if (!q) throw new Error('Practice question not found');

    const evaluation = await aiService.evaluateAnswer({
      question: q.question,
      answer: answer || '',
      expectedSkills: q.tags || [],
      context: []
    });

    // Save evaluation & mark as completed
    await db.practiceQuestion.update({
      where: { id },
      data: {
        answer: answer || '',
        completed: true,
        score: evaluation.score,
        explanation: `${q.explanation || ''}\n\nAI Evaluation feedback: ${evaluation.feedback}`
      }
    });

    return {
      score: evaluation.score,
      feedback: evaluation.feedback
    };
  }
};
