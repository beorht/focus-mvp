# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**F.O.C.U.S** (Find Optimal Career Using Science) is an AI-powered career guidance platform specifically designed for the Uzbekistan job market. The application uses Gemini 2.5 Flash to analyze user interests and abilities, then generates personalized career recommendations with roadmaps tailored to the local market.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Icons**: lucide-react

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture Overview

### Application Flow
1. **Landing Page** (`app/page.tsx`) - Hero page with "Start Journey" button
2. **Assessment** (`app/test/page.tsx`) - 5-question career assessment form
3. **Analysis** (`app/analyze/page.tsx`) - Animated loading while AI processes data
4. **Results** (`app/results/page.tsx`) - Displays recommended profession, salary, and roadmap

### Key Architectural Patterns

#### State Management Strategy
- **Zustand Store** (`store/useLogStore.ts`): Global logging system for debugging/transparency
  - Used throughout app to track user actions, API calls, and system events
  - Log types: INFO, API_REQ, API_RES, ERROR, SYSTEM, USER_ACTION, DATA
- **sessionStorage**: Temporary storage for user flow data
  - `userAnswers`: Assessment responses (used by `/analyze`)
  - `analysisResults`: AI-generated career data (used by `/results`)

#### API Routes Architecture
- **`/api/generate`**: Main AI analysis endpoint
  - Input: User assessment answers (interests, level, priority, workStyle)
  - Output: Structured JSON with profession, match %, salary, roadmap, resources
  - Returns `debugInfo` array for transparent logging

- **`/api/chat`**: Conversational AI assistant
  - Input: User question + optional profession context
  - Output: Contextual career advice for Uzbekistan market
  - Includes predefined Q&A for common project questions

#### Component Organization
- **`components/ChatAssistant.tsx`**: Floating chat widget (FAB pattern)
  - Auto-includes profession context from sessionStorage
  - Syncs with global log store

- **`components/LogConsole.tsx`**: Developer/demo transparency feature
  - Real-time display of all system logs
  - Color-coded by log type

### Data Flow Diagram
```
Landing → Test Page → Analyze Page → Results Page
                ↓           ↓              ↓
         sessionStorage  /api/generate  sessionStorage
                         (Gemini AI)
```

## Important Implementation Notes

### Environment Variables
- **GEMINI_API_KEY**: Required for AI features
  - Set in `.env.local` (not committed to git)
  - Used by both `/api/generate` and `/api/chat` routes

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)
- Example: `import { useLogStore } from '@/store/useLogStore'`

### AI Prompt Engineering
Both API routes use structured prompts optimized for Uzbekistan market context:
- `/api/generate`: Requires strict JSON output format, includes salary expectations for UZ market
- `/api/chat`: Conversational with predefined responses about the F.O.C.U.S project

### Styling Patterns
- Dark theme: Background `#1d1d1d`, Cards `#191919`
- Gradient accent: `from-blue-600 to-purple-600`
- Tailwind v4 uses `@tailwindcss/postcss` plugin (no `tailwind.config.js`)

## Testing the Application

### Quick API Test
From the landing page, click "Test API" button to verify Gemini connection.

### Full User Flow Test
1. Click "Start Journey" → Answer 5 questions → Wait for analysis → Review results
2. Open LogConsole to see real-time API calls and responses
3. Use ChatAssistant (floating button) to ask career questions

### Common Development Scenarios

**Adding a new question to assessment:**
- Edit `questions` array in `app/test/page.tsx`
- Update answer mapping in `handleSubmit()` function
- Ensure compatibility with `/api/generate` prompt expectations

**Modifying AI analysis prompt:**
- Edit prompt in `app/api/generate/route.ts`
- JSON structure changes require updates in results page consumption

**Adding new log types:**
- Update `LogType` in `store/useLogStore.ts`
- Add color coding in `LogConsole.tsx` if needed

## Project Conventions

- All user-facing text is in Russian (except code/variable names)
- UI uses lucide-react icons consistently
- API routes include `debugInfo` array for transparency
- Client components marked with `'use client'` directive
- TypeScript strict mode enabled
