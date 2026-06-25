# Disaster Recovery Plan

## Recovery Objectives

| System | RPO | RTO |
| --- | --- | --- |
| Cloud Run services | 15 minutes | 30 minutes |
| Firestore | 24 hours, lower with PITR | 4 hours |
| Cloud Storage exports | 24 hours | 4 hours |
| Secret Manager | latest valid version | 30 minutes |

## Backups

- Enable Firestore scheduled exports to a locked Cloud Storage bucket.
- Enable Firestore point-in-time recovery where available.
- Apply Cloud Storage object versioning for generated exports.
- Keep Secret Manager previous versions enabled during rotations.

## Restore Procedure

1. Freeze deploys and identify the last known good timestamp.
2. Restore Firestore from scheduled export or PITR.
3. Promote previous Cloud Run revision if application behavior caused data corruption.
4. Restore or promote Secret Manager versions as needed.
5. Run smoke tests and targeted tenant verification.

## DR Exercise

Run a staging restore quarterly and record restore duration, data loss window, and missing automation.
