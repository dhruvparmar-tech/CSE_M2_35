import { GeminiService } from './GeminiService.js';
import { MockAIService } from './MockAIService.js';
import { AIService } from './AIService.js';
import { logger } from '../utils/logger.js';

// Read env vars at call-time (not import-time) — dotenv may not have run yet
function createAIService(): AIService {
  const hasRealKey = process.env.GEMINI_API_KEY &&
                     process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  const useMock = process.env.USE_MOCK_AI === 'true' || !hasRealKey;

  if (useMock) {
    logger.info('Using Mock AI Service');
    return new MockAIService();
  } else {
    logger.info('Using Real Gemini AI Service');
    return new GeminiService();
  }
}

// Lazy singleton — created on first import of this module, but module itself
// is only imported after dotenv runs (via dynamic import in server.ts)
export const aiService: AIService = createAIService();
