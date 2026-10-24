# AI Technical Interview Platform

A production-ready, AI-powered technical interview platform where candidates can take realistic technical interviews conducted by an AI interviewer. Built with React, Node.js/Express, and OpenAI.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-22+-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)

## 🏗️ Architecture

```
Candidate Browser
       ↓
  React Frontend (Vite + TypeScript + Tailwind)
       ↓  HTTP/REST
  Express Backend (Node.js + TypeScript)
       ↓  OpenAI SDK
  OpenAI API (GPT-4o)
       ↓
  Express Backend
       ↓  JSON Response
  React Frontend
```

> **Security**: The OpenAI API key exists **only** on the server. The frontend communicates exclusively with our backend API. The key is never exposed to the browser.

## ✨ Features

### AI-Powered Interviews
- **Real AI interviewer** using GPT-4o for question generation
- **Adaptive follow-up questions** based on candidate responses
- **AI evaluation** with detailed scoring and feedback
- **Professional interviewer persona** that tests understanding, not memorization

### Interview Types
- Technical Screening
- Coding Interview
- Frontend / Backend / Full Stack
- System Design
- Algorithms & Data Structures

### Coding Challenges
- **Monaco Editor** with syntax highlighting
- Support for JavaScript, TypeScript, Python, Java, C++, Go
- Code execution abstraction (ready for Judge0/Piston integration)
- AI-powered code evaluation (correctness, complexity, quality)

### Analytics & Tracking
- Performance charts over time
- Skill radar breakdown
- Interview history with filters
- Detailed per-question review

### Practice Mode
- AI-generated practice questions
- Multiple categories and difficulties
- Targeted practice for weak areas

## 📁 Project Structure

```
ai-interview-platform/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # UI + feature components
│   │   │   ├── ui/           # Reusable UI primitives
│   │   │   ├── interview/    # Interview-specific components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── results/      # Results display components
│   │   │   ├── voice/        # Voice recording components
│   │   │   └── common/       # Shared components
│   │   ├── pages/            # Route page components
│   │   ├── layouts/          # Layout wrappers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand state stores
│   │   ├── services/api/     # Backend API client layer
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions
│   │   ├── data/             # Mock data & static options
│   │   ├── routes/           # Router configuration
│   │   └── lib/              # Library utilities (cn, etc.)
│   └── .env                  # Frontend env vars
│
├── server/                    # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # Express route definitions
│   │   ├── services/         # Business logic services
│   │   ├── middleware/       # Auth, error handling, validation
│   │   ├── ai/              # AI integration layer
│   │   │   ├── prompts/     # Prompt templates
│   │   │   ├── AIService.ts  # Interface
│   │   │   ├── OpenAIService.ts  # Real OpenAI implementation
│   │   │   └── MockAIService.ts  # Development fallback
│   │   ├── database/        # Prisma + in-memory fallback
│   │   ├── types/           # Shared types & Zod schemas
│   │   └── utils/           # Helpers (logger, tokens, context)
│   └── .env                 # Backend env vars (API keys here)
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── .env.example              # Environment variable template
├── package.json              # Root monorepo scripts
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (recommended: 22+)
- **npm** 10+
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **PostgreSQL** (optional — in-memory fallback available for development)

### 1. Clone and Install

```bash
cd ai-interview-platform

# Install root dependencies
npm install

# Install client and server dependencies
npm run install:all
```

### 2. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example server/.env
```

Edit `server/.env`:

```env
# REQUIRED for real AI interviews
OPENAI_API_KEY=sk-your-actual-openai-api-key

# PostgreSQL connection (optional - uses in-memory DB if not set)
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_interview_platform

# JWT secret (change this!)
JWT_SECRET=your-secure-random-string-here

# Server port
PORT=5000

# Frontend URL for CORS
CLIENT_URL=http://localhost:5173

# Set to true to use mock AI (no OpenAI calls)
USE_MOCK_AI=false
```

The client env (`client/.env`) is pre-configured:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Database Setup (Optional)

If using PostgreSQL:

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

If **not** using PostgreSQL, the server will automatically use an in-memory database (data resets on restart).

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### 5. Start an Interview

1. Sign up at http://localhost:5173/signup
2. Configure your interview (role, difficulty, topics)
3. Click "Start AI Interview"
4. Answer AI-generated technical questions
5. Receive detailed evaluation and feedback

## 🔑 OpenAI API Key

### How to Get Your API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys** in the sidebar
4. Click **Create new secret key**
5. Copy the key (starts with `sk-`)
6. Add it to `server/.env` as `OPENAI_API_KEY`

### API Key Security

- ✅ Key is stored **only** in `server/.env`
- ✅ Key is **never** sent to the frontend
- ✅ Key is **never** logged in console output
- ✅ All AI requests go through the backend proxy
- ❌ `VITE_OPENAI_API_KEY` does NOT exist — by design

### Cost Considerations

The platform uses GPT-4o. Approximate costs per interview:
- ~10 questions: ~$0.05–$0.15
- With follow-ups: ~$0.10–$0.25
- Full evaluation: ~$0.05–$0.10

Token management is implemented to minimize costs (context compaction, reasonable limits).

## 🤖 How AI Interviews Work

### Question Generation
The AI generates contextual technical questions based on:
- Selected role (e.g., Frontend Developer)
- Experience level (Junior → Principal)
- Difficulty (Easy → Expert)
- Chosen technologies and topics

### Adaptive Follow-ups
After each answer, the AI decides:
- **Strong answer** → Asks deeper, more advanced follow-up
- **Weak answer** → Probes for basic understanding
- **Complete answer** → Moves to next topic

### Evaluation
Each answer is scored on:
- Technical Accuracy (0–100)
- Depth of Understanding (0–100)
- Problem Solving (0–100)
- Communication (0–100)

### Final Results
At interview completion, the AI generates:
- Overall score
- Per-skill breakdown
- Strengths and weaknesses
- Specific recommendations for improvement

## 🔧 Development Mode

### Mock AI Mode

If you don't have an OpenAI API key or want to develop without API calls:

```env
# In server/.env
USE_MOCK_AI=true
```

The application will display a banner: *"AI API is not configured. Development mock mode is enabled."*

Mock mode provides realistic responses with artificial delays, allowing full UI development.

### Replacing OpenAI

The AI layer uses an interface (`AIService`). To add another provider:

1. Create `server/src/ai/YourProviderService.ts`
2. Implement the `AIService` interface
3. Update `server/src/ai/index.ts` to select your provider

### Code Execution

Code execution uses a pluggable provider architecture:

1. **Development**: `MockExecutionProvider` (simulated results)
2. **Production**: Integrate Judge0, Piston, or Docker sandbox
3. Update `server/src/services/codeExecutionService.ts`

## 📜 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews` | Create interview |
| GET | `/api/interviews` | List interviews |
| GET | `/api/interviews/:id` | Get interview |
| POST | `/api/interviews/:id/start` | Start interview |
| POST | `/api/interviews/:id/answer` | Submit answer |
| POST | `/api/interviews/:id/followup` | Get follow-up |
| POST | `/api/interviews/:id/complete` | Complete interview |
| GET | `/api/interviews/:id/results` | Get results |

### Code Execution
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/code/run` | Run code |
| POST | `/api/code/submit` | Submit solution |

### Practice
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/practice/generate` | Generate questions |
| GET | `/api/practice` | List practice |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| PUT | `/api/profile` | Update profile |

## 🔒 Security

- **Helmet** for HTTP security headers
- **CORS** restricted to frontend origin
- **Rate limiting** (100 req/15min general, 20 req/15min for AI endpoints)
- **JWT authentication** with HTTP-only cookies
- **bcryptjs** password hashing
- **Zod** input validation on all endpoints
- **Request size limits** (10MB max body)
- **Error sanitization** (no internal details leaked to client)

## 🏗️ Production Build

```bash
# Build both frontend and backend
npm run build

# Frontend output: client/dist/
# Backend output: server/dist/

# Start production server
cd server && node dist/server.js
```

For production deployment:
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure PostgreSQL with `DATABASE_URL`
4. Set `USE_MOCK_AI=false`
5. Set `OPENAI_API_KEY` to your production key
6. Serve `client/dist/` via nginx or similar
7. Run `server/dist/server.js` behind a reverse proxy

## 🧪 Testing

```bash
# Run backend tests
npm test
```

Tests mock the `AIService` interface — no real OpenAI calls in automated tests.

## 📄 License

MIT
