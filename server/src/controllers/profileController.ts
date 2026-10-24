import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profileService.js';

export const profileController = {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const profile = await profileService.getProfile(userId);
      res.json(profile);
    } catch (error) { next(error); }
  },
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const profile = await profileService.updateProfile(userId, req.body);
      res.json(profile);
    } catch (error) { next(error); }
  }
};
