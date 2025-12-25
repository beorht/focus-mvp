# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**F.O.C.U.S** (Find Optimal Career Using Science) is an AI-powered career guidance platform specifically designed for the Uzbekistan job market. The application uses Gemini 2.5 Flash to analyze user interests and abilities, then generates personalized career recommendations with roadmaps tailored to the local market.

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with persist middleware)
- **AI Integration**: Google Generative AI (Gemini 2.5 Flash)
- **Animations**: Framer Motion
- **Smooth Scroll**: Lenis
- **Icons**: lucide-react
- **Process Manager**: PM2 (production deployment)

## Development Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000)

# Production
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint

# PM2 Process Management
npm run pm2:start       # Start app with PM2
npm run pm2:stop        # Stop PM2 process
npm run pm2:restart     # Restart PM2 process
npm run pm2:delete      # Delete PM2 process
npm run pm2:logs        # View PM2 logs
npm run pm2:monit       # Monitor PM2 processes
npm run pm2:status      # Check PM2 status

# Deployment
npm run deploy          # Full deployment script (build + PM2)
./deploy.sh             # Manual deployment script
```

## Architecture Overview

### Application Flow
1. **Landing Page** (`app/page.tsx`) - Hero page with "Start Journey" button
2. **Assessment** (`app/test/page.tsx`) - 5-question career assessment form
3. **Analysis** (`app/analyze/page.tsx`) - Animated loading while AI processes data
4. **Results** (`app/results/page.tsx`) - Displays recommended profession, salary, and roadmap
5. **Lesson Page** (`app/lesson/page.tsx`) - Interactive learning path with topics, quizzes, and progress tracking
6. **Demo Page** (`app/demo/page.tsx`) - Hackathon demo page with video showcase

### Key Architectural Patterns

#### State Management Strategy (Zustand)

The app uses three Zustand stores with different persistence strategies:

1. **`useLogStore`** (`store/useLogStore.ts`) - Session-only logging
   - Global logging system for debugging/transparency
   - Log types: INFO, API_REQ, API_RES, ERROR, SYSTEM, USER_ACTION, DATA
   - NOT persisted (resets on page refresh)

2. **`useThemeStore`** (`store/useThemeStore.ts`) - Persisted theme state
   - Manages light/dark theme toggle
   - Persisted to localStorage via Zustand persist middleware
   - Key: `focus-theme-storage`

3. **`useLanguageStore`** (`store/useLanguageStore.ts`) - Persisted language state
   - Manages language selection: Russian (ru), Uzbek Cyrillic (uz-cyrl), Uzbek Latin (uz-latn)
   - Persisted to localStorage via Zustand persist middleware
   - Key: `focus-language-storage`

#### Additional Storage Layer
- **sessionStorage**: Temporary storage for user flow data
  - `userAnswers`: Assessment responses (used by `/analyze`)
  - `analysisResults`: AI-generated career data (used by `/results`)

#### API Routes Architecture

Three API endpoints handle AI interactions:

1. **`/api/generate`** - Main AI analysis endpoint
   - Input: User assessment answers (interests, level, priority, workStyle)
   - Output: Structured JSON with profession, match %, salary, roadmap, resources
   - Returns `debugInfo` array for transparent logging
   - Supports API key rotation (see Environment Variables section)

2. **`/api/chat`** - Conversational AI assistant
   - Input: User question + optional profession context
   - Output: Contextual career advice for Uzbekistan market
   - Includes predefined Q&A for common project questions
   - Supports API key rotation

3. **`/api/translate`** - Content translation endpoint
   - Used for multi-language support
   - Translates UI content between Russian, Uzbek Cyrillic, and Uzbek Latin

#### Component Organization

Key reusable components:

- **`components/ChatAssistant.tsx`** - Floating chat widget (FAB pattern)
  - Auto-includes profession context from sessionStorage
  - Syncs with global log store

- **`components/LogConsole.tsx`** - Developer/demo transparency feature
  - Real-time display of all system logs
  - Color-coded by log type

- **`components/ThemeToggle.tsx`** - Theme switcher component
  - Toggles between light/dark mode
  - Persists preference via useThemeStore

- **`components/LanguageSwitcher.tsx`** - Language selector
  - Switches between ru/uz-cyrl/uz-latn
  - Persists preference via useLanguageStore

- **`components/QuizSection.tsx`** - Interactive quiz component
  - Used in lesson page for knowledge checks
  - Supports multiple question types

- **`components/ReflectionSection.tsx`** - Learning reflection component
  - Prompts users to reflect on learned material

### Data Flow Diagram
```
Landing → Test Page → Analyze Page → Results Page → Lesson Page
                ↓           ↓              ↓              ↓
         sessionStorage  /api/generate  sessionStorage  localStorage
                         (Gemini AI)                    (progress)
```

## Important Implementation Notes

### Environment Variables

The application supports API key rotation to work around Gemini's free tier rate limits (20 requests/day per key):

- **GEMINI_API_KEY**: Single API key (backward compatibility)
- **GEMINI_API_KEYS**: Multiple API keys for rotation (recommended)
  - Format: `key1,key2,key3,key4`
  - System automatically rotates on quota errors (429)
  - Free tier: 20 requests/day per key
  - With 5 keys = 100 requests/day
  - Set in `.env.local` (not committed to git)
  - Used by `/api/generate`, `/api/chat`, and `/api/translate` routes
  - See `API_KEYS_SETUP.md` for detailed instructions

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)
- Example: `import { useLogStore } from '@/store/useLogStore'`

### AI Prompt Engineering
All API routes use structured prompts optimized for Uzbekistan market context:
- `/api/generate`: Requires strict JSON output format, includes salary expectations for UZ market
- `/api/chat`: Conversational with predefined responses about the F.O.C.U.S project
- `/api/translate`: Handles translation between Russian and Uzbek (Cyrillic/Latin)

### Styling Patterns
- **Dark theme**: Background `#1d1d1d`, Cards `#191919`
- **Light theme**: Background `#f9fafb`, Cards white
- **Gradient accent**: `from-blue-600 to-purple-600`
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin (no `tailwind.config.js`)
- **Theme switching**: Handled via `useThemeStore` with localStorage persistence

### Internationalization (i18n)
- **Supported languages**: Russian (ru), Uzbek Cyrillic (uz-cyrl), Uzbek Latin (uz-latn)
- **Translation hook**: `hooks/useTranslation.ts` provides translation function
- **Translation API**: `/api/translate` for dynamic content translation
- **Persistence**: Language preference stored in localStorage via `useLanguageStore`

### Production Deployment (PM2)
- **Config file**: `ecosystem.config.js` defines PM2 process settings
- **Deployment script**: `deploy.sh` automates build and PM2 restart
- **Process name**: `focus-mvp`
- **Log files**: Stored in `logs/` directory (pm2-error.log, pm2-out.log, pm2-combined.log)
- **Memory limit**: 1GB max memory restart
- **Port**: 3000 (production)

## Common Development Scenarios

### Adding a new question to assessment
- Edit `questions` array in `app/test/page.tsx`
- Update answer mapping in `handleSubmit()` function
- Ensure compatibility with `/api/generate` prompt expectations

### Modifying AI analysis prompt
- Edit prompt in `app/api/generate/route.ts`
- JSON structure changes require updates in results page consumption

### Adding new log types
- Update `LogType` in `store/useLogStore.ts`
- Add color coding in `LogConsole.tsx` if needed

### Adding a new language
- Update `Language` type in `store/useLanguageStore.ts`
- Add language option in `LanguageSwitcher.tsx`
- Update translation dictionaries in `hooks/useTranslation.ts`

### Adding new theme colors
- Update theme in `useThemeStore.ts` if adding third theme option
- Modify color classes in `ThemeToggle.tsx` and `app/globals.css`

### Deploying to production
1. Ensure `.env.local` has production API keys
2. Run `npm run deploy` to build and start with PM2
3. Verify with `npm run pm2:status`
4. Check logs with `npm run pm2:logs`

## Project Conventions

- All user-facing text uses multi-language support (Russian primary, Uzbek secondary)
- UI uses lucide-react icons consistently
- API routes include `debugInfo` array for transparency
- Client components marked with `'use client'` directive
- TypeScript strict mode enabled
- Zustand stores use persist middleware for state that should survive page refresh
- Session-only data (like logs) should NOT use persist middleware
