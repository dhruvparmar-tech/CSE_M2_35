import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

// Lazy singleton — created on first use so env vars are definitely loaded
let _genAI: GoogleGenerativeAI | null | undefined = undefined;

export function getGenAI(): GoogleGenerativeAI {
  if (_genAI === undefined) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
      logger.warn('GEMINI_API_KEY is not set. Real AI service will fail if used.');
      _genAI = null;
    } else {
      _genAI = new GoogleGenerativeAI(key);
    }
  }
  if (!_genAI) throw new Error('Gemini client not initialized — set GEMINI_API_KEY in server/.env');
  return _genAI;
}

// Kept for backward compat but use getGenAI() inside service methods
export { };
