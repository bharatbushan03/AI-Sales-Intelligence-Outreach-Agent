#!/usr/bin/env bash
# Provision Google Secret Manager secrets for Sales Intelligence Platform
# Usage: ./scripts/setup-secrets.sh <environment> <project-id>
# Example: ./scripts/setup-secrets.sh production sales-intelligence-prod

set -euo pipefail

ENVIRONMENT="${1:-development}"
PROJECT_ID="${2:-}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Usage: $0 <environment> <project-id>"
  echo "  environment: development | staging | production"
  exit 1
fi

echo "Setting up secrets for environment: $ENVIRONMENT in project: $PROJECT_ID"

SECRETS=(
  "gemini-api-key-${ENVIRONMENT}"
  "firebase-private-key-${ENVIRONMENT}"
  "firebase-client-email-${ENVIRONMENT}"
)

for secret in "${SECRETS[@]}"; do
  if gcloud secrets describe "$secret" --project="$PROJECT_ID" &>/dev/null; then
    echo "Secret $secret already exists, skipping creation"
  else
    echo "Creating secret: $secret"
    gcloud secrets create "$secret" \
      --project="$PROJECT_ID" \
      --replication-policy="automatic" \
      --labels="environment=${ENVIRONMENT},app=sales-intelligence"
  fi
done

echo ""
echo "Add secret values (run interactively or pipe from secure source):"
echo "  echo -n 'YOUR_KEY' | gcloud secrets versions add gemini-api-key-${ENVIRONMENT} --data-file=- --project=$PROJECT_ID"
echo "  gcloud secrets versions add firebase-private-key-${ENVIRONMENT} --data-file=path/to/key.pem --project=$PROJECT_ID"
echo "  echo -n 'firebase-adminsdk@...' | gcloud secrets versions add firebase-client-email-${ENVIRONMENT} --data-file=- --project=$PROJECT_ID"
echo ""
echo "Grant Cloud Run service account access:"
SA="sales-intelligence-${ENVIRONMENT}@${PROJECT_ID}.iam.gserviceaccount.com"
for secret in "${SECRETS[@]}"; do
  gcloud secrets add-iam-policy-binding "$secret" \
    --project="$PROJECT_ID" \
    --member="serviceAccount:${SA}" \
    --role="roles/secretmanager.secretAccessor"
done

echo "Secret setup complete for $ENVIRONMENT"
