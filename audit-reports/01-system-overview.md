# System Architecture Overview

## Project Structure
- **Total TypeScript Files**: 199
- **Core Architectural Layers**:
  1. **Presentation Layer** (`src/app/`) - Next.js 15 App Router
  2. **Application Layer** (`src/agents/`) - Multi-Agent Orchestration System
  3. **Domain Layer** (`src/agents/specialists/`) - Domain-specific agents
  4. **Platform Layer** (`src/agents/platform/`) - Cross-cutting concerns (AI, memory, observability)
  5. **Infrastructure Layer** (`src/lib/`) - Firebase, repositories, utilities
  6. **API Layer** (`src/app/api/`) - Next.js API routes

## Key Architectural Components

### 1. Multi-Agent Orchestration System
- **Manager Agent** (`src/agents/manager-agent/index.ts`): 
  - Parses user intents and decomposes goals into workflow plans
  - Uses Gemini-based workflow planning) with dependencies (sequential/parallel)
  - Executes workflow plans with retries, timeouts, and observability
  - Integrates with shared memory system for context passing

### 2. Agent Types
- **Research Agent** (`src/agents/specialists/research-agent.ts`): 
  - Company profiling, web analysis, competitor analysis
  - Uses specialized sub-components: Profiler, Web Analyzer, etc.
- **Opportunity Agent** (`src/agents/specialists/opportunity-agent.ts`):
  - Pain point analysis, opportunity scoring
- **Outreach Agent** (`src/agents/specialists/outreach-agent.ts`):
  - Multi-channel message generation (email, LinkedIn, call scripts)
- **CRM Agent** (`src/agents/specialists/crm-agent.ts`):
  - Lead/opportunity management, activity tracking, follow-ups
- **Proposal Agent** (`src/agents/specialists/proposal-agent.ts`):
  - Document generation for proposals, ROI calculations

### 3. Memory & Context System
- **Context Router** (`src/agents/memory/context-router.ts`):
  - Retrieves relevant historical context for user goals
  - Combines company memory, workflow memory, and agent memory
- **Knowledge Graph** (`src/agents/memory/knowledge-graph.ts`):
  - Entity relationship storage for companies, contacts, interactions
- **Message Bus** (`src/agents/memory/message-bus.ts`):
  - Inter-agent communication mechanism
- **Retrieval Engine** (`src/agents/memory/retrieval-engine.ts`):
  - Semantic search for relevant context using embeddings

### 4. Platform Services
- **AI Platform** (`src/agents/platform/platform.ts`):
  - Gemini API integration with fallback mechanisms
  - Prompt management, caching, guardrails, hallucination detection
- **Observability** (`src/agents/observability.ts`):
  - Execution tracing, timeline events, performance metrics
- **Agent Registry** (`src/agents/registry.ts`):
  - Dynamic agent discovery and capability-based lookup

### 5. Data Layer
- **Firestore Database**:
  - Collections: users, organizations, workspaces, leads, opportunities, 
    outreach campaigns, proposals, research reports, workflows, memories
  - Security Rules: Role-based access control with tenant isolation
  - Indexes: Optimized for query patterns (sorting, filtering, compound queries)
- **Repositories** (`src/lib/repositories.ts`):
  - Generic Firestore repository pattern with type safety

### 6. API Endpoints
- **Domain-specific APIs**: `/api/research`, `/api/opportunities`, `/api/outreach`, `/api/crm`, `/api/proposals`
- **System APIs**: `/api/memory` (messaging), `/api/intelligence` (prompt management), `/api/health` (health checks)
- **Admin APIs**: `/api/admin/data` (data management operations)
- **Authentication**: `/api/auth` (user onboarding, session management)

### 7. Deployment Infrastructure
- **Containerization**: Dockerfile for Next.js standalone deployment
- **Cloud Run**: Auto-scaling service with health checks
- **Firebase Hosting**: Static asset delivery with CDN caching
- **Secret Manager**: Gemini API keys, Firebase credentials
- **CI/CD**: GitHub Actions workflows for build, test, deploy
- **Monitoring**: Cloud Monitoring, Cloud Logging integration

