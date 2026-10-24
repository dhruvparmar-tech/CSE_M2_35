import { Request, Response, NextFunction } from 'express';
import { codeExecutionService } from '../services/codeExecutionService.js';

export const codeController = {
  async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language, testCases } = req.body;
      const result = await codeExecutionService.runCode(code, language, testCases);
      res.json(result);
    } catch (error) { next(error); }
  },
  async submitCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language, testCases } = req.body;
      const result = await codeExecutionService.submitCode(code, language, testCases);
      res.json(result);
    } catch (error) { next(error); }
  }
};
