import { Router } from 'express';
import { codeController } from '../controllers/codeController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);
router.post('/run', codeController.runCode);
router.post('/submit', codeController.submitCode);

export default router;
