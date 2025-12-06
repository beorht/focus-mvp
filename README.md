# F.O.C.U.S - Find Optimal Career Using Science

> AI-powered career guidance platform for Uzbekistan job market | AI500 Hackathon 2024

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-green)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-purple)

## 🎯 Project Overview

**F.O.C.U.S** is an AI-powered career navigation platform specifically designed for the Uzbekistan job market. The application uses Google Gemini 2.5 Flash to analyze user interests and abilities, then generates personalized career recommendations with detailed roadmaps tailored to the local market conditions.

### ✨ Key Features

- 📝 **5-Question Career Assessment** - Quick but comprehensive psychotype analysis
- 🤖 **AI-Powered Recommendations** - Gemini 2.5 Flash for intelligent career matching
- 🗺️ **Interactive Roadmap** - Detailed Junior → Middle → Senior career progression
- 💬 **AI Chat Assistant** - Real-time career guidance chatbot with context awareness
- 📊 **Real-Time API Terminal** - Transparent logging system for demo purposes
- 💰 **UZ Market Salary Data** - Accurate salary expectations for Uzbekistan market
- ✨ **Smooth Animations** - Framer Motion blur fade-in effects and Lenis smooth scrolling
- 🎨 **Modern UI/UX** - Dark theme with gradient accents and interactive elements

## 🛠️ Tech Stack

### Core Framework
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Runtime:** Node.js 20+

### Styling & Animation
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion 11+
- **Smooth Scroll:** Lenis
- **Icons:** lucide-react

### State & Data
- **State Management:** Zustand
- **Data Storage:** sessionStorage (client-side)

### AI Integration
- **AI Provider:** Google Generative AI
- **Model:** Gemini 2.5 Flash
- **Features:** Career analysis, conversational chat, roadmap generation

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Gemini API Key** ([Get here](https://aistudio.google.com/app/apikey))

### Installation Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd focus-mvp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create .env.local file in the root directory
touch .env.local
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Setup

### Required: Gemini API Key Configuration

**IMPORTANT:** The application will not work without a valid Gemini API key.

#### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** button
4. Copy the generated API key

#### Step 2: Create `.env.local` File

Create a file named `.env.local` in the root directory of the project:

```bash
# Navigate to project root
cd focus-mvp

# Create .env.local file
touch .env.local
```

#### Step 3: Add API Key to `.env.local`

Open `.env.local` in your text editor and add:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Example:**
```env
GEMINI_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 4: Verify Configuration

After adding the API key:
1. Restart the development server (`npm run dev`)
2. Navigate to [http://localhost:3000](http://localhost:3000)
3. Click "Test API" button on landing page to verify connection

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini AI API key for career analysis | `AIzaSyD...` |

### Troubleshooting

**Error: "GEMINI_API_KEY is not defined"**
- ✅ Ensure `.env.local` file exists in project root
- ✅ Verify API key is correctly pasted (no spaces)
- ✅ Restart development server after adding key

**Error: "API request failed"**
- ✅ Check API key is valid and active
- ✅ Verify you have API quota remaining
- ✅ Check network connection

## 📁 Project Structure

```
focus-mvp/
├── app/
│   ├── page.tsx              # Landing page with animations
│   ├── test/page.tsx         # 5-question assessment flow
│   ├── analyze/page.tsx      # AI processing (animated loader)
│   ├── results/page.tsx      # Career recommendations with roadmap
│   ├── api/
│   │   ├── generate/route.ts # Main AI analysis endpoint
│   │   └── chat/route.ts     # Chat assistant endpoint
│   └── globals.css           # Global styles + Lenis integration
├── components/
│   ├── LogConsole.tsx        # Real-time API logger
│   └── ChatAssistant.tsx     # Floating chat widget
├── store/
│   └── useLogStore.ts        # Global logging state (Zustand)
├── .env.local                # Environment variables (NOT in git)
├── CLAUDE.md                 # Developer guide for AI assistant
└── package.json              # Dependencies
```

## 🎬 User Flow

### Complete Journey

1. **Landing Page** (`/`)
   - Hero section with animations
   - "Start Journey" CTA button
   - Tech stack badges

2. **Assessment** (`/test`)
   - 5 carefully designed questions
   - Multiple choice and single choice options
   - Progress bar with percentage
   - Smooth question transitions

3. **Analysis** (`/analyze`)
   - Animated AI processing stages
   - Real-time status updates
   - Gemini API integration
   - API request/response logging

4. **Results** (`/results`)
   - Recommended profession with match percentage
   - Uzbekistan market salary range
   - Detailed roadmap (Junior/Middle/Senior)
   - Learning resources with links
   - AI chat assistant access

## 🎨 Features Breakdown

### Split Screen Architecture (Demo Mode)
- **Left (65%):** Main user interface
- **Right (35%):** AI Terminal with JSON logs and API responses
  - Color-coded log types
  - Real-time updates
  - Request/Response formatting

### API Routes

#### `POST /api/generate`
Main career analysis endpoint

**Request:**
```json
{
  "interests": ["technology", "creativity"],
  "level": "beginner",
  "priority": "salary",
  "workStyle": "remote"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profession": "Frontend Developer",
    "profession_en": "Frontend Developer",
    "match": 95,
    "salary_uz_sum": "5,000,000 - 15,000,000 сум/месяц",
    "description": "...",
    "roadmap": [...],
    "resources": [...]
  },
  "meta": {
    "request_id": "req_...",
    "timestamp": "2025-12-06T...",
    "processing_time_ms": 2847,
    "ai_model": "Gemini 2.5 Flash",
    "confidence": 0.95
  }
}
```

#### `POST /api/chat`
Conversational assistant endpoint

**Request:**
```json
{
  "question": "Какие навыки нужны для Frontend?",
  "profession": "Frontend Developer"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Для Frontend разработчика важны...",
  "meta": {
    "request_id": "req_...",
    "timestamp": "2025-12-06T...",
    "processing_time_ms": 1234,
    "ai_model": "Gemini 2.5 Flash"
  }
}
```

### Animation Features

#### Framer Motion Animations
- **Blur fade-in effects** - Elements appear from blur to clear
- **Stagger animations** - Sequential element appearance
- **Hover interactions** - Scale and shadow effects
- **Page transitions** - Smooth navigation between pages

#### Lenis Smooth Scroll
- **Inertial scrolling** - Natural momentum-based scrolling
- **Smooth wheel events** - Enhanced mouse wheel behavior
- **Touch optimization** - Optimized for mobile devices

### State Management

#### Zustand Store (`useLogStore`)
- Global logging system
- Real-time log updates
- Type-safe log entries
- Color-coded by type (API_REQ, API_RES, ERROR, etc.)

#### sessionStorage
- `userAnswers` - Assessment responses
- `analysisResults` - AI-generated career data

## 🔧 Development Commands

```bash
# Development
npm run dev      # Start dev server (localhost:3000)

# Production Build
npm run build    # Build optimized production bundle
npm start        # Start production server

# Code Quality
npm run lint     # Run ESLint checks
```

## 🌐 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Configure Environment**
   - Add `GEMINI_API_KEY` in project settings
   - Save and deploy

4. **Deploy**
   - Automatic deployment on push

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

Production server runs on: http://localhost:3000

## 🎯 Testing Checklist

### Essential Tests

- [ ] Landing page loads with animations
- [ ] "Start Journey" button navigates to `/test`
- [ ] All 5 assessment questions are answerable
- [ ] Progress bar updates correctly
- [ ] AI analysis animation plays smoothly
- [ ] Results page displays profession and roadmap
- [ ] Roadmap cards are interactive (hover effects)
- [ ] Chat assistant opens and responds
- [ ] API Terminal logs appear in real-time
- [ ] Smooth scrolling works on results page
- [ ] All animations are smooth and performant

### API Tests

- [ ] API test button works on landing page
- [ ] Gemini API connection successful
- [ ] Career analysis returns valid data
- [ ] Chat assistant provides relevant responses
- [ ] Error handling works when API fails

## 📚 Additional Resources

### Documentation
- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lenis Smooth Scroll](https://lenis.studiofreight.com/)

### Tutorials
- [Get Started with Gemini API](https://ai.google.dev/tutorials/get_started_web)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Framer Motion Tutorial](https://www.framer.com/motion/introduction/)

## 🏆 Hackathon Requirements

### Completed Tasks

✅ **Task 1:** Problem definition (Career guidance gap in Uzbekistan)
✅ **Task 2:** Working MVP with video demo
✅ **Bonus 1:** AI chat assistant with context awareness
✅ **Bonus 2:** API access transparency with real-time logs

### Additional Features

✨ Modern animations with Framer Motion
✨ Smooth scrolling with Lenis
✨ Professional UI/UX design
✨ Mobile-responsive layout
✨ TypeScript for type safety

## 🤝 Contributing

This is a hackathon project created for AI500 Hackathon 2024. For questions, improvements, or collaboration inquiries, please contact the team.

## 📄 License

MIT License - AI500 Hackathon 2024

---

## 🎓 About F.O.C.U.S

**F.O.C.U.S** addresses a critical need in Uzbekistan's job market: helping students and career changers make informed professional decisions based on their interests, skills, and local market realities.

### Problem Statement
Many young professionals in Uzbekistan struggle with:
- Choosing the right career path
- Understanding market salary expectations
- Finding structured learning roadmaps
- Accessing personalized career guidance

### Solution
F.O.C.U.S leverages AI to provide:
- Data-driven career recommendations
- Localized salary information
- Structured skill development paths
- On-demand AI career counseling

---

**Project Timeline:** December 1-7, 2024
**Hackathon:** AI500 2024
**Deadline:** December 7, 2024 23:59 (GMT+5)

Made with ❤️ for AI500 Hackathon
