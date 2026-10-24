import { Router } from 'express';
import { interviewController } from '../controllers/interviewController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { InterviewConfigSchema } from '../types/index.js';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(InterviewConfigSchema), interviewController.createInterview);
router.get('/', interviewController.getInterviews);
router.get('/:id', interviewController.getInterview);
router.post('/:id/start', interviewController.startInterview);
router.post('/:id/answer', interviewController.submitAnswer);
router.post('/:id/followup', interviewController.getFollowUp);
router.post('/:id/complete', interviewController.completeInterview);
router.get('/:id/results', interviewController.getResults);

export default router;
