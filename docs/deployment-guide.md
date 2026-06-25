# Deployment Guide

## Environments

| Environment | Branch | Google Cloud Project | Cloud Run Min/Max |
| --- | --- | --- | --- |
| Development | `feature/*` or manual | `sales-intelligence-dev` | 0 / 5 |
| Staging | `develop` | `sales-intelligence-staging` | 1 / 20 |
| Production | `main` | `sales-intelligence-prod` | 2 / 100 |

## Prerequisites

- Artifact Registry repository: `sales-intelligence`
- Cloud Run service account per environment
- Secret Manager entries from `scripts/setup-secrets.sh`
- Firebase project and Hosting site per environment
- GitHub OIDC workload identity provider

## Deploy Cloud Run

```bash
gcloud run deploy sales-intelligence-api \
  --region=us-central1 \
  --image=us-central1-docker.pkg.dev/PROJECT_ID/sales-intelligence/app:SHA \
  --allow-unauthenticated \
  --service-account=sales-intelligence-production@PROJECT_ID.iam.gserviceaccount.com \
  --set-secrets=GEMINI_API_KEY=gemini-api-key-production:latest,FIREBASE_PRIVATE_KEY=firebase-private-key-production:latest,FIREBASE_CLIENT_EMAIL=firebase-client-email-production:latest \
  --concurrency=100 \
  --timeout=300
```

## Deploy Firebase Hosting

```bash
firebase use production
firebase deploy --only hosting,firestore:rules,firestore:indexes,storage
```

Firebase Hosting rewrites all dynamic traffic to Cloud Run and serves static assets with immutable cache headers.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run security:scan
npm run build
SERVICE_URL=https://SERVICE_URL bash scripts/smoke-test.sh
```

## Rollback

1. Cloud Run: `gcloud run services update-traffic sales-intelligence-api --to-revisions=REVISION=100 --region=us-central1`
2. Firebase Hosting: `firebase hosting:rollback`
3. Secrets: promote the previous Secret Manager version.
4. Firestore: restore from scheduled export or point-in-time recovery.
