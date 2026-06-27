# Architecture Diagrams

## High-Level Architecture Overview

The Autonomous B2B Sales Intelligence Agent platform follows a modern, modular architecture built on Google Cloud Platform with a serverless, multi-agent design.

### Key Components:

1. **Presentation Layer**: Next.js 15 App Router with React 19
   - Server Components for data fetching
   - Client Components for interactivity
   - Tailwind CSS 4 for styling

2. **Application Layer**: Multi-Agent Orchestration System
   - Manager Agent: Intent classification and workflow planning
   - Specialist Agents: Research, Opportunity, Outreach, CRM, Proposal
   - Workflow Engine: Topological execution with retries and timeouts
   - Shared Memory System: Context passing between agents

3. **Platform Services**:
   - AI Platform: Gemini API integration with caching and guardrails
   - Observability: Execution tracing and metrics collection
   - Agent Registry: Dynamic agent discovery

4. **Data Layer**:
   - Firestore: NoSQL database with role-based security rules
   - Cloud Storage: File storage for exports and generated documents
   - Secret Manager: Secure storage for API keys and credentials

5. **Infrastructure**:
   - Cloud Run: Auto-scaling compute for API and agent execution
   - Firebase Hosting: CDN-delivered static assets with SSL/TLS
   - Artifact Registry: Container image storage
   - Cloud Build: CI/CD pipeline

### Data Flow Patterns:

**Direct Agent Calls** (Simple Operations):
```
Frontend → API Route (e.g., /api/research) → Specific Agent → Firestore → Response
```

**Orchestrated Workflows** (Complex Multi-agent Operations):
```
Frontend → API Route → ManagerAgent → Workflow Engine → 
[Agent1 → Agent2 → ... (with dependencies)] → Shared Memory → Final Response
```

**Event-Driven Communication**:
```
Agent A → MessageBus.publish() → MessageBus.subscribe() → Agent B
```

### Security Features:
- Firebase Authentication with Google OAuth
- Role-Based Access Control (RBAC) with Admin/Manager/Sales Rep/Viewer roles
- Tenant isolation via organizationId/workspaceId filtering
- Firestore and Storage security rules enforcing data access policies
- Secret Manager for sensitive credentials (Gemini API keys, Firebase credentials)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Input validation and sanitization

### Deployment Architecture:
- **Development**: Feature branches → Manual deployment or GitHub Actions
- **Staging**: `develop` branch → Auto-deploy to staging project
- **Production**: `main` branch → Auto-deploy to production project
- **Environment Isolation**: Separate GCP projects, service accounts, and secrets per environment
- **Auto Scaling**: Cloud Run with configurable min/max instances per environment
- **Health Checks**: `/api/health` endpoint for liveness/readiness probing
