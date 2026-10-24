/**
 * server.ts — Entry point
 *
 * IMPORTANT: Uses dynamic imports (await import()) intentionally.
 *
 * In ES Modules, static `import` statements are hoisted and evaluated
 * BEFORE any code in this file runs — including dotenv.config().
 * That means modules like ai/index.ts and ai/openai.ts would initialize
 * without the env vars loaded, causing GEMINI_API_KEY to appear unset.
 *
 * Dynamic imports happen AFTER dotenv.config() runs, so all env vars
 * are available when the AI/DB modules first execute.
 */

import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';
import dotenv from 'dotenv';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── 1. Load env FIRST before any other module initializes ───────────────────
const serverEnvPath = path.resolve(__dirname, '../.env');
const rootEnvPath   = path.resolve(__dirname, '../../.env');

if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath });
} else {
  dotenv.config({ path: rootEnvPath });
}

// ─── 2. Now dynamically import — env vars are guaranteed to be loaded ─────────
const { logger }       = await import('./utils/logger.js');
const { default: app } = await import('./app.js');

// ─── 3. Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;

const isRealAI = process.env.GEMINI_API_KEY &&
                 process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
                 process.env.USE_MOCK_AI !== 'true';

if (!isRealAI && process.env.USE_MOCK_AI !== 'true') {
  logger.warn('GEMINI_API_KEY is not set or is a placeholder. Using Mock AI.');
}

const dbMode = process.env.DATABASE_URL ? 'PostgreSQL (Prisma)' : 'In-Memory';
logger.info(`Database Mode: ${dbMode}`);

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
  logger.info(`AI Mode: ${isRealAI ? 'Real Gemini ✓' : 'Mock'}`);
});
