# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**F.O.C.U.S** (Find Optimal Career Using Science) is an algorithm-based career guidance platform specifically designed for the Uzbekistan job market. The application uses the RIASEC (Holland Code) psychometric system to analyze user interests and abilities, then provides personalized career recommendations from 13 professions across multiple industries (IT, Medicine, Engineering, Psychology, Finance, Education, Art, Business).

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (with persist middleware)
- **Matching Algorithm**: RIASEC-based cosine similarity with IT bonus
- **Animations**: Framer Motion
- **Smooth Scroll**: Lenis
- **Icons**: lucide-react
- **AI Chat** (optional): Google Generative AI (Gemini 2.5 Flash) for ChatAssistant only
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
2. **Assessment** (`app/test/page.tsx`) - 12-question RIASEC assessment (2 questions per category)
3. **Analysis** (`app/analyze/page.tsx`) - Animated loading while algorithm processes data
4. **Results** (`app/results/page.tsx`) - Displays 3-6 recommended professions with match percentages, salaries, and key information
5. **Demo Page** (`app/demo/page.tsx`) - Hackathon demo page with video showcase

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
  - `userAnswers`: Assessment responses including RIASEC scores (used by `/analyze`)
  - `analysisResults`: Algorithm-generated profession matches (used by `/results`)

#### Core Matching System

The system uses a local algorithm (no external API calls for profession matching):

1. **Profession Database** (`lib/professionsDatabase.ts`)
   - 13 professions with RIASEC profiles
   - Categories: IT, Medicine, Engineering, Psychology, Finance, Education, Art, Business
   - Each profession has: name (multilingual), category, RIASEC profile, salary, description, required skills, market demand

2. **Matching Algorithm** (`lib/professionMatcher.ts`)
   - Uses cosine similarity between user RIASEC profile and profession RIASEC profile
   - Adds +5% bonus for IT professions
   - Returns 3-6 top matching professions
   - Selection logic:
     - Always top 3 if large gap (>10%) between 3rd and 4th
     - Up to 6 if 4th profession has >60% match
     - Maximum 6 professions

3. **Translation System** (`lib/translations/`)
   - Static translations for professions, categories, RIASEC categories
   - No AI translation for profession matching (multilingual data built-in)

#### API Routes

One API endpoint for AI interaction:

1. **`/api/chat`** - Conversational AI assistant (OPTIONAL - uses Gemini)
   - Input: User question + optional profession context
   - Output: Contextual career advice for Uzbekistan market
   - Includes predefined Q&A for common project questions
   - Supports API key rotation

Note: `/api/translate` still exists but is only used by chat (if needed). Profession matching uses built-in multilingual data.

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

### Data Flow Diagram
```
Landing → Test Page → Analyze Page → Results Page
                ↓           ↓              ↓
         sessionStorage  Local Algorithm  sessionStorage
                         (RIASEC Matching)
```

**Algorithm Flow**:
1. User completes 12-question RIASEC assessment (2 questions per category: R, I, A, S, E, C)
2. Test page calculates RIASEC scores (0-10 per category) and percentages
3. Generates Holland Code (top 3 categories, e.g., "IRA")
4. Analyze page calls `matchProfessions()` with user's RIASEC percentages
5. Algorithm computes cosine similarity for all 13 professions
6. Adds +5% IT bonus
7. Returns 3-6 top matches
8. Results page displays professions with match%, salary, skills, strengths

## Important Implementation Notes

### Environment Variables

**OPTIONAL**: Only needed if using ChatAssistant (AI chat feature)

The application supports API key rotation for ChatAssistant:

- **GEMINI_API_KEY**: Single API key (backward compatibility)
- **GEMINI_API_KEYS**: Multiple API keys for rotation (recommended)
  - Format: `key1,key2,key3,key4`
  - System automatically rotates on quota errors (429)
  - Free tier: 20 requests/day per key
  - With 5 keys = 100 requests/day
  - Set in `.env.local` (not committed to git)
  - Used ONLY by `/api/chat` route (ChatAssistant)
  - See `API_KEYS_SETUP.md` for detailed instructions

**Note**: Profession matching does NOT require API keys - it runs locally using the RIASEC algorithm.

### Path Aliases
- `@/*` maps to project root (configured in `tsconfig.json`)
- Example: `import { useLogStore } from '@/store/useLogStore'`

### Algorithm Details

**RIASEC-based Matching**:
- Uses Holland Code psychometric system (6 categories: R, I, A, S, E, C)
- Cosine similarity formula: `similarity = (A · B) / (||A|| × ||B||)`
- Each profession has a predefined RIASEC profile (e.g., Frontend Dev: R:70, I:80, A:40, S:20, E:30, C:40)
- User profile calculated from 15 RIASEC questions (Likert scale 1-5)
- IT bonus ensures slight preference for tech careers

**AI Chat (Optional)**:
- `/api/chat`: Conversational with predefined responses about the F.O.C.U.S project
- Uses Gemini 2.5 Flash for contextual career advice

### Styling Patterns
- **Dark theme**: Background `#1d1d1d`, Cards `#191919`
- **Light theme**: Background `#f9fafb`, Cards white
- **Gradient accent**: `from-blue-600 to-purple-600`
- **Tailwind v4**: Uses `@tailwindcss/postcss` plugin (no `tailwind.config.js`)
- **Theme switching**: Handled via `useThemeStore` with localStorage persistence

### Internationalization (i18n)
- **Supported languages**: Russian (ru), Uzbek Cyrillic (uz-cyrl), Uzbek Latin (uz-latn)
- **Translation hook**: `hooks/useTranslation.ts` provides translation function for UI strings
- **Built-in translations**: All profession data (names, descriptions, skills) stored in multilingual format
- **Translation system**: `lib/translations/` - static dictionaries for professions, categories, RIASEC
- **Persistence**: Language preference stored in localStorage via `useLanguageStore`

### Production Deployment (PM2)
- **Config file**: `ecosystem.config.js` defines PM2 process settings
- **Deployment script**: `deploy.sh` automates build and PM2 restart
- **Process name**: `focus-mvp`
- **Log files**: Stored in `logs/` directory (pm2-error.log, pm2-out.log, pm2-combined.log)
- **Memory limit**: 1GB max memory restart
- **Port**: 3000 (production)

## Common Development Scenarios

### Adding a new profession
1. Add profession to `professionsDatabase` array in `lib/professionsDatabase.ts`
2. Define RIASEC profile (6 values: R, I, A, S, E, C)
3. Add multilingual fields: name, description, requiredSkills
4. Set category, salary, marketDemand
5. No code changes needed elsewhere - algorithm automatically picks it up

### Modifying matching algorithm
- Edit `matchProfessions()` function in `lib/professionMatcher.ts`
- Adjust IT_BONUS value to change IT priority
- Modify `selectTopProfessions()` to change how many professions to show
- Update cosine similarity logic if needed

### Adding a new RIASEC question
- Add question to `riasecQuestions` array in `app/test/page.tsx`
- Ensure it's assigned to correct category (R, I, A, S, E, or C)
- Update `maxScore` in `handleSubmit()` if changing questions per category
- Current: 2 questions per category, maxScore = 10

### Adding new log types
- Update `LogType` in `store/useLogStore.ts`
- Add color coding in `LogConsole.tsx` if needed

### Adding a new language
1. Update `Language` type in `store/useLanguageStore.ts` and `lib/translations/`
2. Add language option in `LanguageSwitcher.tsx`
3. Update translation dictionaries in `hooks/useTranslation.ts`
4. Add translations to all professions in `professionsDatabase.ts`

### Adding new theme colors
- Update theme in `useThemeStore.ts` if adding third theme option
- Modify color classes in `ThemeToggle.tsx` and `app/globals.css`

### Deploying to production
1. (Optional) Ensure `.env.local` has API keys if using ChatAssistant
2. Run `npm run deploy` to build and start with PM2
3. Verify with `npm run pm2:status`
4. Check logs with `npm run pm2:logs`

## Project Conventions

- All user-facing text uses multi-language support (Russian primary, Uzbek secondary)
- UI uses lucide-react icons consistently
- Client components marked with `'use client'` directive
- TypeScript strict mode enabled
- Zustand stores use persist middleware for state that should survive page refresh
- Session-only data (like logs) should NOT use persist middleware
- All professions stored with multilingual data (no runtime translation needed for matching)
- RIASEC system is the core of profession matching - preserve it when making changes
