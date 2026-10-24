import { Router } from 'express';
import { practiceController } from '../controllers/practiceController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.post('/generate', practiceController.generatePractice);
router.get('/', practiceController.getPractice);
router.post('/:id/answer', practiceController.submitPracticeAnswer);

export default router;
