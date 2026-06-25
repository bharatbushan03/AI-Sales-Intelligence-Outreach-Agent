# Google Cloud Architecture — Sales Intelligence Platform

## Overview

The Autonomous B2B Sales Intelligence Agent platform runs on Google Cloud with a serverless, auto-scaling architecture designed for production SaaS workloads.

## Architecture Diagram

```mermaid
flowchart TB
    subgraph Users["Users & Teams"]
        Browser[Web Browser]
        Mobile[Mobile Clients]
    end

    subgraph Edge["Edge Layer"]
        FH[Firebase Hosting<br/>CDN + SSL]
        LB[Cloud Load Balancing]
    end

    subgraph Compute["Compute Layer — Cloud Run"]
        API[API Service<br/>Next.js Standalone]
        Agents[Agent Orchestration<br/>Workflow Engine]
        Analytics[Analytics Service]
        Export[Export Service]
    end

    subgraph AI["AI Layer"]
        Gemini[Gemini API<br/>1.5 Pro / Flash]
        Vertex[Vertex AI<br/>Future Scale]
    end

    subgraph Data["Data Layer"]
        FS[(Cloud Firestore)]
        GCS[(Cloud Storage)]
        SM[Secret Manager]
    end

    subgraph Ops["Operations"]
        CB[Cloud Build]
        AR[Artifact Registry]
        CM[Cloud Monitoring]
        CL[Cloud Logging]
        AR2[Cloud Armor]
    end

    Browser --> FH
    Mobile --> FH
    FH --> LB
    LB --> API
    API --> Agents
    API --> Analytics
    API --> Export
    Agents --> Gemini
    Agents --> FS
    Analytics --> FS
    Export --> GCS
    API --> FS
    API --> SM
    CB --> AR
    AR --> API
    API --> CM
    API --> CL
    LB --> AR2
```

## Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant FH as Firebase Hosting
    participant CR as Cloud Run
    participant FS as Firestore
    participant G as Gemini API
    participant SM as Secret Manager

    U->>FH: HTTPS Request
    FH->>CR: Rewrite to Cloud Run
    CR->>SM: Fetch secrets (runtime)
    CR->>FS: Auth + Data Query
    CR->>G: Agent Workflow
    G-->>CR: Grounded Response
    CR-->>FH: JSON / SSR Response
    FH-->>U: Cached Static / Dynamic
```

## Environment Separation

| Environment | Project ID | Min Instances | Max Instances | Memory | CPU |
|-------------|-----------|---------------|---------------|--------|-----|
| Development | `sales-intelligence-dev` | 0 | 5 | 512Mi | 1 |
| Staging | `sales-intelligence-staging` | 1 | 20 | 1Gi | 2 |
| Production | `sales-intelligence-prod` | 2 | 100 | 2Gi | 4 |

## Service Topology

### Cloud Run Services

All services share the same container image with route-based separation:

| Service | Routes | Purpose |
|---------|--------|---------|
| API Layer | `/api/*` | REST API, auth, CRUD |
| Agent Orchestration | `/api/intelligence`, `/api/research`, `/api/outreach` | Multi-agent workflows |
| Analytics | `/api/admin/data`, dashboard metrics | Executive dashboards |
| Export | `/api/proposals/export` | Document generation |

### Firebase Hosting

- Serves static assets with immutable cache headers (1 year)
- Rewrites all dynamic traffic to Cloud Run
- Security headers enforced at edge

### Firestore

- Multi-tenant data isolation via organization/workspace scoping
- Composite indexes for analytics queries
- Security rules enforce RBAC at database layer

### Cloud Storage

- Organization-scoped file storage
- Export artifacts (proposals, reports)
- 10MB upload limit per object

## Secret Management

Secrets are stored in **Google Secret Manager** and injected at runtime:

| Secret | Purpose |
|--------|---------|
| `gemini-api-key-{env}` | Gemini API authentication |
| `firebase-private-key-{env}` | Firebase Admin SDK |
| `firebase-client-email-{env}` | Service account email |

Public Firebase config (`NEXT_PUBLIC_*`) is set as Cloud Run environment variables during deployment.

## Network & Security

- TLS termination at Firebase Hosting / Cloud Run
- IAM service accounts per environment
- Secret Manager access via `roles/secretmanager.secretAccessor`
- Firestore security rules + API RBAC middleware
- Cloud Armor (production) for DDoS protection

## Auto Scaling

Cloud Run scales based on:
- Concurrent requests (target: 100 per instance)
- CPU utilization
- Request queue depth

Production maintains minimum 2 instances for warm starts and sub-2s dashboard latency.

## Deployment Pipeline

```mermaid
flowchart LR
    PR[Pull Request] --> CI[Lint + Test + Scan]
    CI --> Merge[Merge to main]
    Merge --> CB[Cloud Build]
    CB --> AR[Artifact Registry]
    AR --> Deploy[Cloud Run Deploy]
    Deploy --> Smoke[Smoke Tests]
    Smoke --> FH2[Firebase Hosting]
```

## Rollback Strategy

1. **Cloud Run**: `gcloud run services update-traffic --to-revisions=PREVIOUS=100`
2. **Container**: Redeploy previous image tag from Artifact Registry
3. **Firebase Hosting**: `firebase hosting:rollback`
4. **Firestore**: Point-in-time recovery from automated backups

## Related Documentation

- [Deployment Guide](../deployment-guide.md)
- [Infrastructure Guide](../infrastructure-guide.md)
- [Operations Runbook](../operations-runbook.md)
