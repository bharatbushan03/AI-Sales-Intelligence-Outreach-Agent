# Load Testing Report

## Target

- 100 concurrent users without service degradation.
- Dashboard p95 below 2 seconds.
- Workflow execution p95 below 10 seconds.
- Search p95 below 500 milliseconds.

## Local Harness

Use the built-in load harness for health and smokeable HTTP endpoints:

```bash
LOAD_TEST_URL=https://SERVICE_URL/api/health \
LOAD_TEST_CONCURRENCY=100 \
LOAD_TEST_REQUESTS=1000 \
node scripts/load-test.mjs
```

## Required Production Scenarios

| Scenario | Endpoint/Flow | Target |
| --- | --- | --- |
| Health and routing | `/api/health` | p95 below 250ms |
| Dashboard | `/dashboard` | p95 below 2s |
| Search | intelligence/research APIs | p95 below 500ms |
| Workflow execution | agent orchestration APIs | p95 below 10s |
| Export | proposal export API | 99% success |

## Report Template

| Date | Environment | Concurrency | Requests | p95 | Failure Rate | Result |
| --- | --- | --- | --- | --- | --- | --- |
| TBD | staging | 100 | 1000 | TBD | TBD | Pending live environment |
