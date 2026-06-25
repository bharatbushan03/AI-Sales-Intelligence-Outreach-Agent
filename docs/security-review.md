# Security Review

## Controls Implemented

- CSP, HSTS, referrer, permissions, and content-type headers.
- Secret Manager for Gemini and Firebase Admin secrets.
- Firebase Auth and RBAC middleware for API protection.
- Firestore and Storage rules for tenant isolation.
- GitHub Actions dependency audit and secret scanning.

## Required Production Checks

- Confirm no committed `.env` files or service account JSON.
- Rotate any secrets previously used outside Secret Manager.
- Enable Cloud Armor for production edge protection.
- Restrict deploy permissions to GitHub OIDC and release managers.
- Validate session cookie settings in production browsers.

## Residual Risks

- CSP currently allows inline scripts/styles for framework compatibility; move to nonce-based CSP if compliance requires it.
- Load tests should include authenticated workflow execution, not only health checks.
- Cloud Run services are logically separated by route today; dedicated services may be needed for noisy workloads.
