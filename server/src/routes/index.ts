import { Router } from 'express';
import authRoutes from './authRoutes.js';
import interviewRoutes from './interviewRoutes.js';
import codeRoutes from './codeRoutes.js';
import practiceRoutes from './practiceRoutes.js';
import profileRoutes from './profileRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/interviews', interviewRoutes);
router.use('/code', codeRoutes);
router.use('/practice', practiceRoutes);
router.use('/profile', profileRoutes);

export default router;
