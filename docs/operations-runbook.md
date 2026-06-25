# Operations Runbook

## Health Checks

- Endpoint: `/api/health`
- Healthy responses: `healthy` or `degraded`
- Unhealthy response: HTTP 503

## Common Incidents

| Symptom | First Checks | Mitigation |
| --- | --- | --- |
| API latency above 2s | Cloud Run CPU, Firestore latency, cold starts | increase min instances, inspect slow queries |
| Workflow latency above 10s | Gemini latency, retry volume, agent errors | enable graceful fallback, reduce workflow fan-out |
| Authentication failures | Firebase status, session route logs, token expiry | rotate affected sessions and validate auth config |
| Export failures | Cloud Storage IAM, object size, service memory | retry job, raise memory, inspect storage rules |
| Secret errors | Secret Manager IAM and latest version | promote previous secret version or re-grant accessor role |

## Incident Response

1. Declare severity and owner.
2. Check `/api/health`, Cloud Run revisions, and GitHub deployment history.
3. Inspect Cloud Logging for correlated request IDs.
4. Roll back if customer impact persists beyond 10 minutes.
5. Capture timeline, root cause, and preventive action.

## Smoke Test

```bash
SERVICE_URL=https://SERVICE_URL bash scripts/smoke-test.sh
```

## Load Test

```bash
LOAD_TEST_URL=https://SERVICE_URL/api/health \
LOAD_TEST_CONCURRENCY=100 \
LOAD_TEST_REQUESTS=1000 \
node scripts/load-test.mjs
```
