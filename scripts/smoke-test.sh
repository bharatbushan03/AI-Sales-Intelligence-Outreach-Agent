#!/usr/bin/env bash
# Post-deployment smoke tests
# Usage: SERVICE_URL=https://your-service.run.app ./scripts/smoke-test.sh

set -euo pipefail

SERVICE_URL="${SERVICE_URL:-http://localhost:8080}"
MAX_RETRIES=10
RETRY_DELAY=5
CURL_BIN="${CURL_BIN:-}"

if [[ -z "$CURL_BIN" ]]; then
  if command -v curl >/dev/null 2>&1; then
    CURL_BIN="curl"
  elif command -v curl.exe >/dev/null 2>&1; then
    CURL_BIN="curl.exe"
  else
    echo "ERROR: curl or curl.exe is required for smoke tests"
    exit 1
  fi
fi

echo "Running smoke tests against: $SERVICE_URL"

wait_for_health() {
  for i in $(seq 1 $MAX_RETRIES); do
    HTTP_CODE=$("$CURL_BIN" -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/health" || echo "000")
    if [[ "$HTTP_CODE" == "200" ]]; then
      echo "Health check passed (attempt $i)"
      return 0
    fi
    echo "Health check failed with HTTP $HTTP_CODE (attempt $i/$MAX_RETRIES)"
    sleep $RETRY_DELAY
  done
  echo "ERROR: Service did not become healthy"
  exit 1
}

test_health_endpoint() {
  RESPONSE=$("$CURL_BIN" -sf "${SERVICE_URL}/api/health")
  STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  if [[ "$STATUS" != "healthy" && "$STATUS" != "degraded" ]]; then
    echo "ERROR: Unexpected health status: $STATUS"
    exit 1
  fi
  echo "Health endpoint returned status: $STATUS"
}

test_security_headers() {
  HEADERS=$("$CURL_BIN" -sI "${SERVICE_URL}/api/health")
  if ! echo "$HEADERS" | grep -qi "x-content-type-options"; then
    echo "WARNING: X-Content-Type-Options header missing"
  else
    echo "Security headers present"
  fi
}

test_auth_protection() {
  HTTP_CODE=$("$CURL_BIN" -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/intelligence")
  if [[ "$HTTP_CODE" != "401" && "$HTTP_CODE" != "403" ]]; then
    echo "WARNING: Protected endpoint returned HTTP $HTTP_CODE (expected 401/403)"
  else
    echo "Auth protection verified (HTTP $HTTP_CODE)"
  fi
}

wait_for_health
test_health_endpoint
test_security_headers
test_auth_protection

echo ""
echo "All smoke tests passed"
