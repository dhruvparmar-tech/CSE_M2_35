import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';

export const authController = {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      res.cookie('token', result.token, { httpOnly: true });
      res.status(201).json(result);
    } catch (error) { next(error); }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.cookie('token', result.token, { httpOnly: true });
      res.json(result);
    } catch (error) { next(error); }
  },
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const user = await authService.getMe(userId);
      res.json(user);
    } catch (error) { next(error); }
  }
};
