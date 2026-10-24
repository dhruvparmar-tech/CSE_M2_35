import { Request, Response, NextFunction } from 'express';
import { practiceService } from '../services/practiceService.js';

export const practiceController = {
  async generatePractice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const { category, difficulty, count } = req.body;
      const questions = await practiceService.generatePractice(userId, category, difficulty, count);
      res.json(questions);
    } catch (error) { next(error); }
  },
  async getPractice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const questions = await practiceService.getPractice(userId);
      res.json(questions);
    } catch (error) { next(error); }
  },
  async submitPracticeAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { answer } = req.body;
      const evaluation = await practiceService.submitPracticeAnswer(req.params.id as string, answer);
      res.json(evaluation);
    } catch (error) { next(error); }
  }
};
