# Autonomous B2B Sales Intelligence Agent

An enterprise-grade, multi-agent sales orchestration platform powered by Google's AI ecosystem (Gemini API & Vertex AI), Firebase, and Google Cloud Platform. 

This platform autonomously researches prospects, evaluates pain points, matches solution value propositions, generates multi-channel outreach campaigns, schedules follow-ups, drafts agreement proposals in Google Drive, and updates CRM records.

---

## 🚀 Key Features

*   **Manager Agent Orchestration**: A dynamic orchestrator using **Gemini 1.5 Pro/Flash** that parses user intents, decomposes goals into task nodes, schedules executions, and synthesizes outcomes.
*   **Asynchronous Graph Engine**: Runs sequential and parallel steps based on topological dependency resolution, featuring configurable retries with exponential backoffs and timeout handlers.
*   **Google Search Grounding**: Specialist agents fetch and ground news, financials, and company profiles in real-time to avoid hallucinations.
*   **Structured Telemetry Tracing**: Built-in observability layer recording execution durations, step milestones, output records, and error traces.
*   **Enterprise SaaS Interface**: Sleek dark-mode responsive dashboard shell containing leads databases, campaign drafting views, CRM status trackers, and settings hubs.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React icons, React Query, Zustand.
*   **Backend**: Next.js API Route Handlers, Firebase Admin SDK, Firestore.
*   **AI Engine**: Google Gemini API (`@google/generative-ai` SDK), Vertex AI ready.
*   **Database**: Cloud Firestore (NoSQL) with generic Repository patterns.
*   **Authentication**: Firebase Auth (Google OAuth).
*   **Testing**: Vitest for high-speed unit & integration test suites.
*   **Quality Controls**: ESLint, Prettier, Husky pre-commit checks, Commitlint conventional messages, GitHub Actions CI.

---

## 📁 Repository Directory Structure

```
src/
├── app/                       # Next.js App Router (Layouts & Pages)
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
├── components/                # Reusable UI Layout Components
│   └── navigation.tsx         # Responsive Sidebar Navigation
├── agents/                    # Multi-Agent Orchestration Layer
│   ├── manager-agent/         # Gemini Intent classification & planning agent
│   ├── specialists/           # Specialist agents executing workflows
│   │   ├── research-agent.ts  # Fetches profile, competitors, and news
│   │   ├── opportunity-agent.ts # Map pain points and value props
│   │   ├── outreach-agent.ts  # Drafts emails and LinkedIn messages
│   │   ├── crm-agent.ts       # Logs telemetry data & syncs lead states
│   │   └── proposal-agent.ts  # Prepares pricing and drafts contract docs
│   ├── engine.ts              # Topological async executor, retries, timeouts
│   ├── context.ts             # Orchestrator memory & session manager
│   ├── observability.ts       # Computes timeline stats & traces
│   ├── registry.ts            # Dynamic registration singleton
│   └── types.ts               # Core agent types and interface specs
├── lib/                       # Third-party SDK initializations
│   ├── env.ts                 # Runtime environment validation schema (Zod)
│   ├── firebase.ts            # Client-side Firebase instance reference
│   ├── firebase-admin.ts      # Server-side Admin SDK instance reference
│   └── repository.ts          # Generic Firestore repository class
├── utils/                     # Core utility methods
│   ├── api-response.ts        # Standard Success/Error JSON builders
│   └── logger.ts              # Local/Cloud Logging formatter
tests/                         # Verification Suites
└── orchestrator.test.ts       # Registry, engine execution, & mock tests
```

---

## 💻 Local Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js v20+** and **npm** installed on your local system.

### 2. Clone the Repository & Install Packages
```bash
git clone <repository_url>
cd visualization
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` into a new `.env.local` file and fill in your Gemini and Firebase credentials:
```bash
cp .env.example .env.local
```

### 4. Running the Development Server
Launch the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3050) in your browser to view the SaaS layout and explore the navigation shell.

---

## 🧪 Verification & Testing

Verify that all systems, registry methods, parallel schedulers, retries, and orchestration routines are functioning correctly:

```bash
# Run unit & integration test suites
npx vitest run

# Run eslint quality checks
npm run lint

# Compile and type check files
npx tsc --noEmit
```

---

## ☁️ Google Cloud Deployment Instructions

### 1. Build and Host Frontend Assets on Firebase
Initialize and deploy static aspects to Firebase Hosting:
```bash
# Log in to Firebase CLI
npx firebase login

# Deploy build bundles
npx firebase deploy --only hosting
```

### 2. Deploy Server Backend to Google Cloud Run
Compile the backend API and containerize it to deploy securely to Cloud Run:
```bash
# Configure gcloud credentials
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>

# Build the docker container via Cloud Build
gcloud builds submit --tag gcr.io/<YOUR_PROJECT_ID>/sales-agent-backend

# Deploy container on Cloud Run with environment bindings
gcloud run deploy sales-agent-backend \
  --image gcr.io/<YOUR_PROJECT_ID>/sales-agent-backend \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=<YOUR_KEY>,SKIP_ENV_VALIDATION=false"
```
Ensure to map Serverless VPC Access Connectors if restricting database access rules.
