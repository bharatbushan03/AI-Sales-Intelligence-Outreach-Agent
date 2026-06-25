#!/usr/bin/env bash
# Bootstrap GCP project for Sales Intelligence Platform
# Usage: ./scripts/setup-gcp-project.sh <project-id> <environment>

set -euo pipefail

PROJECT_ID="${1:-}"
ENVIRONMENT="${2:-development}"
REGION="${3:-us-central1}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <project-id> <environment> [region]"
  exit 1
fi

echo "Bootstrapping GCP project: $PROJECT_ID ($ENVIRONMENT) in $REGION"

APIS=(
  "run.googleapis.com"
  "cloudbuild.googleapis.com"
  "artifactregistry.googleapis.com"
  "secretmanager.googleapis.com"
  "firestore.googleapis.com"
  "firebase.googleapis.com"
  "storage.googleapis.com"
  "monitoring.googleapis.com"
  "logging.googleapis.com"
  "cloudtrace.googleapis.com"
  "iam.googleapis.com"
  "cloudresourcemanager.googleapis.com"
)

for api in "${APIS[@]}"; do
  echo "Enabling $api..."
  gcloud services enable "$api" --project="$PROJECT_ID"
done

echo "Creating Artifact Registry repository..."
gcloud artifacts repositories create sales-intelligence \
  --project="$PROJECT_ID" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Sales Intelligence Platform containers" \
  2>/dev/null || echo "Repository already exists"

echo "Creating service account..."
SA_NAME="sales-intelligence-${ENVIRONMENT}"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create "$SA_NAME" \
  --project="$PROJECT_ID" \
  --display-name="Sales Intelligence ${ENVIRONMENT}" \
  2>/dev/null || echo "Service account already exists"

ROLES=(
  "roles/datastore.user"
  "roles/secretmanager.secretAccessor"
  "roles/storage.objectAdmin"
  "roles/logging.logWriter"
  "roles/cloudtrace.agent"
  "roles/monitoring.metricWriter"
)

for role in "${ROLES[@]}"; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="$role" \
    --quiet
done

echo "Creating Firestore database (if not exists)..."
gcloud firestore databases create \
  --project="$PROJECT_ID" \
  --location="$REGION" \
  --type=firestore-native \
  2>/dev/null || echo "Firestore database already exists"

echo ""
echo "GCP project bootstrap complete."
echo "Next steps:"
echo "  1. ./scripts/setup-secrets.sh $ENVIRONMENT $PROJECT_ID"
echo "  2. Update .firebaserc with project ID"
echo "  3. Deploy via Cloud Build or GitHub Actions"
