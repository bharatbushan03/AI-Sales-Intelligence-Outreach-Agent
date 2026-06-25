# Cost Analysis

Estimates are directional and should be replaced with Google Cloud billing export data after production traffic exists.

| Scale | Assumptions | Estimated Monthly Cost |
| --- | --- | --- |
| Low | 10 users, 25k requests, light Gemini usage, 5GB storage | $75-$200 |
| Medium | 100 users, 1M requests, daily workflows, 50GB storage | $750-$2,500 |
| High | 1,000 users, 20M requests, heavy workflows, 500GB storage | $7,500-$25,000 |

## Cost Drivers

- Gemini tokens per workflow.
- Firestore document reads for dashboards and analytics.
- Cloud Run min instances in staging and production.
- Cloud Storage exports and retention.
- Cloud Logging ingestion from verbose agent traces.

## Optimization Plan

- Cache dashboard aggregates and repeated research lookups.
- Use Gemini Flash-class models for low-risk summarization paths.
- Cap workflow fan-out and add circuit breakers.
- Set log sampling for high-volume success events.
- Use lifecycle rules for export artifacts.
