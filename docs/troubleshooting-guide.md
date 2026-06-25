# Troubleshooting Guide

## Build Fails

- Run `npm ci` to ensure the lockfile is honored.
- Run `npm run typecheck` and inspect the first TypeScript error.
- Set `SKIP_ENV_VALIDATION=true` only in CI build contexts, not production runtime.

## Cloud Run Does Not Start

- Confirm the container listens on `PORT=8080`.
- Check `/api/health` startup probe logs.
- Verify all Secret Manager bindings exist for the target environment.
- Confirm the service account has `roles/secretmanager.secretAccessor`.

## Firebase Hosting Rewrite Fails

- Confirm `firebase.json` points to the correct Cloud Run service and region.
- Redeploy hosting after Cloud Run service creation.
- Check Cloud Run ingress and unauthenticated invocation settings.

## Authentication or RBAC Fails

- Confirm Firebase public config matches the deployed environment.
- Validate server-side Admin SDK secrets.
- Inspect API logs for role validation failures.

## Firestore Permission Denied

- Confirm the request includes organization/workspace identifiers.
- Validate Firestore rules using the Firebase emulator.
- Check composite indexes for analytics queries.
