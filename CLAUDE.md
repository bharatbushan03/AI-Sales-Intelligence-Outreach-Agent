# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Autonomous B2B Sales Intelligence Agent** platform - an enterprise-grade, multi-agent sales orchestration platform powered by Google's AI ecosystem (Gemini API & Vertex AI), Firebase, and Google Cloud Platform. The platform autonomously researches prospects, evaluates pain points, matches solution value propositions, generates multi-channel outreach campaigns, schedules follow-ups, drafts agreement proposals in Google Drive, and updates CRM records.

## Key Features

- **Manager Agent Orchestration**: Dynamic orchestrator using Gemini 1.5 Pro/Flash that parses user intents, decomposes goals into task nodes, schedules executions, and synthesizes outcomes
- **Asynchronous Graph Engine**: Runs sequential and parallel steps based on topological dependency resolution with configurable retries and exponential backoffs
- **Google Search Grounding**: Specialist agents fetch and ground news, financials, and company profiles in real-time to avoid hallucinations
- **Structured Telemetry Tracing**: Built-in observability layer recording execution durations, step milestones, output records, and error traces
- **Enterprise SaaS Interface**: Sleek dark-mode responsive dashboard shell containing leads databases, campaign drafting views, CRM status trackers, and settings hubs

## Technology Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React icons, React Query, Zustand
- **Backend**: Next.js API Route Handlers, Firebase Admin SDK, Firestore
- **AI Engine**: Google Gemini API (@google/generative-ai SDK), Vertex AI ready
- **Database**: Cloud Firestore (NoSQL) with generic Repository patterns
- **Authentication**: Firebase Auth (Google OAuth)
- **Testing**: Vitest for high-speed unit & integration test suites
- **Quality Controls**: ESLint, Prettier, Husky pre-commit checks, Commitlint conventional messages, GitHub Actions CI

## Project Structure

```
src/
├── app/                       # Next.js 15 App Router (Layouts & Pages)
│   ├── api/                   # Serverless Next.js API Routes
│   ├── dashboard/             # Dashboard main page
│   ├── leads/                 # Leads database grid
│   ├── research/              # Scraping & grounding controls
│   ├── outreach/              # Campaign review & approval view
│   ├── crm/                   # CRM Sync monitoring
│   ├── proposals/             # Google Drive Doc exporter
│   ├── settings/              # API keys & configurations
│   ├── globals.css            # Tailwind global layout properties
│   ├── layout.tsx             # Root page shell mapping NavigationShell
│   └── page.tsx               # Welcome entry page
├── agents/                    # Multi-Agent Orchestration Layer
│   ├── manager-agent/         # Gemini Intent classification & planning agent
│   │   └── index.ts           # Manager agent implementation
│   ├── specialists/           # Specialist agents executing workflows
│   │   ├── crm/               # CRM agent implementation
│   │   │   └── crm-agent.ts
│   │   ├── opportunity/       # Opportunity agent implementation
│   │   │   └── opportunity-agent.ts
│   │   ├── outreach/          # Outreach agent implementation
│   │   │   └── outreach-agent.ts
│   │   ├── proposal/          # Proposal agent implementation
│   │   │   └── proposal-agent.ts
│   │   └── research/          # Research agent implementation
│   │       └── research-agent.ts
│   ├── engine.ts              # Topological async executor, retries, timeouts
│   ├── context.ts             # Orchestrator memory & session manager
│   ├── observability.ts       # Computes timeline stats & traces
│   ├── registry.ts            # Dynamic registration singleton
│   └── types.ts               # Core agent types and interface specs
├── lib/                       # Third-party SDK initializations & utilities
│   ├── env.ts                 # Runtime environment validation schema (Zod)
│   ├── firebase.ts            # Client-side Firebase instance reference
│   ├── firebase-admin.ts      # Server-side Admin SDK instance reference
│   ├── repositories.ts        # Generic Firestore repository implementations
│   ├── repository.ts          # Base repository class
│   ├── auth-middleware.ts     # Authentication middleware
│   ├── auth-providers.ts      # Authentication providers
│   ├── google-calendar.ts     # Google Calendar integration
│   ├── google-drive.ts        # Google Drive integration
│   ├── rbac.ts                # Role-based access control
│   ├── audit-trail.ts         # Audit trail logging
│   ├── event-store.ts         # Event sourcing implementation
│   ├── email-service.ts       # Email service wrapper
│   └── version-control.ts     # Version control utilities
├── components/                # Reusable UI Components (organized by feature)
│   ├── accessibility/         # Accessibility-focused components
│   ├── analytics/             # Analytics dashboard components
│   ├── auth/                  # Authentication UI components
│   ├── calendar/              # Calendar integration components
│   ├── collaboration/         # Team collaboration features
│   ├── crm/                   # CRM integration components
│   ├── memory/                # Memory and knowledge base components
│   ├── microinteractions/     # Animated UI feedback components
│   ├── navigation/            # Navigation shell and sidebar
│   ├── onboarding/            # User onboarding flow components
│   ├── opportunities/         # Sales opportunity tracking
│   ├── outreach/              # Outreach campaign components
│   ├── performance/           # Performance monitoring and analytics
│   ├── proposals/             # Proposal generation components
│   └── research/              # Research agent components
├── context/                   # React context providers
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript type definitions
├── utils/                     # Core utility methods
│   ├── api-response.ts        # Standard Success/Error JSON builders
│   └── logger.ts              # Local/Cloud Logging formatter
└── tests/                     # Verification Suites
    ├── auth-collaboration.test.ts
    ├── crm.test.ts
    ├── database.test.ts
    ├── google-calendar.test.ts
    ├── google-drive.test.ts
    ├── memory.test.ts
    ├── opportunity.test.ts
    ├── orchestrator.test.ts   # Registry, engine execution, & mock tests
    ├── outreach.test.ts
    ├── platform.test.ts
    ├── proposal.test.ts
    └── research.test.ts
```

## Key Technologies & Patterns

### Multi-Agent Architecture
- **Manager Agent** (`src/agents/manager-agent/index.ts`): Orchestrates workflows using Gemini for intent classification and planning
- **Specialist Agents** (`src/agents/specialists/`): Domain-specific agents for CRM, Opportunity, Outreach, Proposal, and Research
- **Workflow Engine** (`src/agents/engine.ts`): Executes workflow plans with topological ordering, retries, and timeouts
- **Agent Registry** (`src/agents/registry.ts`): Dynamic agent registration and lookup system
- **Observability** (`src/agents/observability.ts`): Tracks execution traces and timeline events

### Data Layer
- **Repository Pattern** (`src/lib/repository.ts`): Generic Firestore operations with type safety
- **Schema Definitions** (`src/lib/firestore-schema.ts`): Firestore collections and document structures
- **Firebase Integration** (`src/lib/firebase.ts`, `src/lib/firebase-admin.ts`): Client and Admin SDK initialization

### State Management
- **Zustand**: Used for global state management in React components
- **React Query**: Handles server state and data fetching with caching
- **Context API** (`src/context/`): Provides theme, authentication, and other shared state

### Styling & UI
- **Tailwind CSS 4**: Utility-first CSS framework with custom configuration in `tailwind.config.ts`
- **CSS Variables**: Used for theme variables in `src/app/globals.css`
- **clsx/tailwind-merge**: Utility classes for conditional class joining
- **Lucide Icons**: Consistent icon set throughout the UI

## Development Workflow

### Setup
1. Install dependencies: `npm install`
2. Copy environment template: `cp .env.example .env.local`
3. Fill in required environment variables (Firebase config, Gemini API key)
4. Ensure Firebase project is set up and configured

### Development Commands
- **Start Development Server**: `npm run dev` - Starts Next.js dev server at http://localhost:3000
- **Build for Production**: `npm run build` - Creates production build
- **Start Production Server**: `npm run start` - Runs the built application
- **Lint Code**: `npm run lint` - Runs ESLint for code quality checks
- **Type Check**: `npx tsc --noEmit` - Runs TypeScript type checking
- **Run Tests**: `npm run test` - Executes Vitest test suite
- **Format Code**: `npx prettier --write .` - Formats code with Prettier
- **Setup Git Hooks**: `npm run prepare` - Installs Husky git hooks

### Testing

### Testing Approach**: `*.test.ts` or `tests

### Testing Guidelines
- Write unit tests in `__tests__` folders or alongside component files
- Use Vitest for fast unit and integration testing
- Mock external services (Firebase, Google AI) in tests using vitest's mocking capabilities
- Follow existing test patterns in the `tests/` directory
- Run tests with `npm run test` or `npx vitest run`

### Code Quality
- Follow existing code patterns and conventions in the codebase
- Use TypeScript strictly - avoid `any` types when possible
- Implement proper error handling with meaningful error messages
- Write self-documenting code with clear function and variable names
- Follow ESLint and Prettier configurations
- Add JSDoc comments for complex functions and components

### AI Agent Development Patterns
When working with agents:
1. Extend base agent patterns found in specialist agents
2. Register new agents in the agent registry (`src/agents/registry.ts`)
3. Define clear input/output types in `src/agents/types.ts`
4. Implement proper error handling and timeout mechanisms
5. Use the observability layer for tracing agent executions
6. Follow the dependency injection pattern for agent capabilities

### Firebase & Database Patterns
- Use the repository pattern in `src/lib/repository.ts` for data access
- Follow Firestore security rules in `firestore.rules`
- Refer to indexes in `firestore.indexes.json` for composite queries
- Use environment-specific configurations in `.env.local`
- Handle Firebase authentication properly in API routes

### Next.js 15 Specific Guidelines
- Files in `app/` are Server Components by default
- Use `'use client'` directive for Client Components that need interactivity
- Leverage Server Components for data fetching to minimize client-side JavaScript
- Use Next.js API routes in `src/app/api/` for backend endpoints
- Follow App Router conventions for routing, layouts, and route groups

### Environment Variables
Required variables in `.env.local`:
- `NODE_ENV`: Development/production flag
- `GEMINI_API_KEY`: Google Gemini API key
- Firebase configuration (both client and admin):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY` (with proper newline escaping)
- `CLOUD_RUN_URL`: For production deployments

### Deployment
The application supports multiple deployment targets:
1. **Vercel**: Optimal for Next.js applications (default)
2. **Firebase Hosting**: For static frontend hosting
3. **Google Cloud Run**: For containerized backend deployment
4. **Traditional Node.js hosting**: Any platform supporting Node.js applications

Refer to the README.md for detailed deployment instructions to Firebase and Google Cloud Run.

## Getting Help
- Refer to the official Next.js 15 documentation for framework-specific questions
- Examine existing components and pages in `src/` for implementation patterns
- Check the README.md for comprehensive feature descriptions and architecture details
- Review test files in `tests/` for testing patterns and mocking examples