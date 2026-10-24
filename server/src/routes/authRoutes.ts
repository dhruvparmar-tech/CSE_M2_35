import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { SignupSchema, LoginSchema } from '../types/index.js';

const router = Router();

router.post('/signup', validate(SignupSchema), authController.signup);
router.post('/login', validate(LoginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

export default router;
