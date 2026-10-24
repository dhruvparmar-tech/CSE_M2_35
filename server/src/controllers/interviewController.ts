import { Request, Response, NextFunction } from 'express';
import { interviewService } from '../services/interviewService.js';

export const interviewController = {
  async createInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const interview = await interviewService.createInterview(userId, req.body);
      res.status(201).json(interview);
    } catch (error) { next(error); }
  },
  async getInterviews(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const interviews = await interviewService.getInterviews(userId);
      res.json(interviews);
    } catch (error) { next(error); }
  },
  async getInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const interview = await interviewService.getInterview(req.params.id as string, userId);
      res.json(interview);
    } catch (error) { next(error); }
  },
  async startInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await interviewService.startInterview(req.params.id as string);
      res.json(question);
    } catch (error) { next(error); }
  },
  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const evaluation = await interviewService.submitAnswer(req.params.id as string, req.body);
      res.json(evaluation);
    } catch (error) { next(error); }
  },
  async getFollowUp(req: Request, res: Response, next: NextFunction) {
    try {
      const followUp = await interviewService.getFollowUp(req.params.id as string);
      res.json(followUp);
    } catch (error) { next(error); }
  },
  async completeInterview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await interviewService.completeInterview(req.params.id as string);
      res.json(result);
    } catch (error) { next(error); }
  },
  async getResults(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await interviewService.getResults(req.params.id as string);
      res.json(results);
    } catch (error) { next(error); }
  }
};
