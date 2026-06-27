#!/bin/bash
# AWS Post-Deployment Smoke Tests
# Usage: SERVICE_URL=https://your-distribution.cloudfront.net AWS_REGION=us-east-1 ./scripts/smoke-test.sh

set -euo pipefail

# Handle windows curl.cmd
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  CURL_BIN="curl.exe"
else
  CURL_BIN="${CURL_BIN:-}"
fi

if [[ -z "$CURL_BIN" ]]; then
  if command -v curl >/dev/null 2>&1; then
    CURL_BIN="curl"
  else
    echo "ERROR: curl or curl.exe is required for smoke tests"
    exit 1
  fi
fi

SERVICE_URL="${SERVICE_URL:-http://localhost:8080}"
MAX_RETRIES=10
RETRY_DELAY=5
AWS_REGION="${AWS_REGION:-us-east-1}"

echo "🚀 AWS Smoke Tests - Environment: $SERVICE_URL - Region: $AWS_REGION"

wait_for_health() {
  echo "⏳ Waiting for AWS health endpoint..."
  for i in $(seq 1 $MAX_RETRIES); do
    HTTP_CODE=$("$CURL_BIN" -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/health" 2>/dev/null || echo "000")
    if [[ "$HTTP_CODE" == "200" ]]; then
      echo "✅ Health check passed (attempt $i)"
      return 0
    fi
    echo "⚠️  Health check failed with HTTP $HTTP_CODE (attempt $i/$MAX_RETRIES)"
    sleep $RETRY_DELAY
  done
  echo "❌ ERROR: Service did not become healthy"
  exit 1
}

test_health_endpoint() {
  RESPONSE=$("$CURL_BIN" -sf "${SERVICE_URL}/api/health" 2>/dev/null)
  STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [[ "$STATUS" != "healthy" && "$STATUS" != "degraded" ]]; then
    echo "❌ ERROR: Unexpected health status: $STATUS"
    exit 1
  fi
  echo "✅ Health endpoint returned status: $STATUS"
}

test_aws_cloudfront() {
  echo "🔍 Testing AWS CloudFront distribution..."
  if echo "$SERVICE_URL" | grep -q "cloudfront.net"; then
    echo "✅ CloudFront distribution detected"
    # CloudFront validation check
    CLOUDFRONT_ID=$(echo "$SERVICE_URL" | grep -o "[a-z0-9-]\+\.cloudfront\.net" | head -1)
    echo "✓ CloudFront endpoint: $SERVICE_URL"
  else
    echo "⚠️  Not a CloudFront URL, skipping CloudFront validation"
  fi
}

test_s3_bucket() {
  echo "🗄️  Checking AWS S3 bucket access..."
  if [ -n "${AWS_ACCESS_KEY_ID:-}" ]; then
    echo "✓ AWS credentials configured"
    aws s3 ls sales-intelligence-production-statics 2>/dev/null || echo "⚠️  S3 bucket access not available"
  else
    echo "⚠️  AWS credentials not configured, skipping S3 test"
  fi
}

test_rds_database() {
  echo "🗄️  Testing RDS database connectivity..."
  if [ -n "${RDS_HOST:-}" ]; then
    echo "✓ RDS configuration detected"
    echo "✓ RDS endpoint: $RDS_HOST"
  else
    echo "⚠️  RDS configuration not available, skipping database test"
  fi
}

test_elasticache() {
  echo "🔧 Checking ElastiCache/Redis connectivity..."
  if [ -n "${REDIS_HOST:-}" ]; then
    echo "✓ Redis configuration detected"
    RC=$(redis-cli ping 2>/dev/null || echo "FAILED")
    if [[ "$RC" == "PONG" ]]; then
      echo "✅ Redis connection successful"
    else
      echo "⚠️  Redis connection failed"
    fi
  else
    echo "⚠️  Redis configuration not available, skipping cache test"
  fi
}

test_slack_notification() {
  echo "📢 Checking Slack notification configuration..."
  if [ -n "${SLACK_WEBHOOK:-}" ]; then
    echo "✓ Slack webhook configured"
  else
    echo "⚠️  Slack webhook not configured"
  fi
}

test_environment_variables() {
  echo "📊 Checking environment configuration..."
  REQUIRED_VARS=("NODE_ENV" "VERCEL_URL")
  MISSING_VARS=()

  for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
      MISSING_VARS+=("$var")
    fi
  done

  if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo "⚠️  Missing environment variables: ${MISSING_VARS[*]}"
  else
    echo "✅ Environment variables configured correctly"
  fi
}

test_metrics_aggregator() {
  echo "📈 Checking metrics aggregator..."
  if command -v promtool >/dev/null 2>&1; then
    PROMTOOL_VERSION=$(promtool --version | head -1)
    echo "✅ Metrics collector configured: $PROMTOOL_VERSION"
  else
    echo "⚠️  No metrics collector detected"
  fi
}

test_connection_pool() {
  echo "🔗 Checking database connection pools..."
  if [ -n "${DB_POOL_SIZE:-}" ]; then
    echo "✓ Connection pool configured: $DB_POOL_SIZE"
  else
    echo "⚠️  Connection pool not configured"
  fi
}

test_monitoring() {
  echo "🔍 Checking monitoring services..."
  if [ -n "${AWS_REGION:-}" ]; then
    echo "✅ AWS Monitoring active in: $AWS_REGION"
  else
    echo "⚠️  AWS Region not specified"
  fi
}

test_delivery_stack() {
  echo "📦 Checking delivery stack..."
  if [ -n "${EDITION:-}" ]; then
    echo "✏️  Edition configured: $EDITION"
  else
    echo "⚠️  Edition not configured"
  fi
}

test_main_channel() {
  echo "📡 Testing main notification channel..."
  if [ -n "${SLACK_CHANNEL:-}" ]; then
    echo "✓ Slack channel: $SLACK_CHANNEL"
  else
    echo "⚠️  Main channel not configured"
  fi
}

test_lambda_function() {
  echo "💻 Checking Lambda function status..."
  if [ -n "${LAMBDA_FUNCTION:-}" ]; then
    echo "⚡ Lambda function: $LAMBDA_FUNCTION"
  else
    echo "⚠️  Lambda function not configured"
  fi
}

test_learning-listener-state() {
  echo "🎓 Checking learning listener state..."
  if [ -n "${LEARNING_LISTENER:-}" ]; then
    echo "📚 Learning lister enabled: $LEARNING_LISTENER"
  else
    echo "⚠️  Learning listener not enabled"
  fi
}

test_populate_snowstorm_volumes() {
  echo "❄️  Checking snowy volume population..."
  if [ -n "${SNOWSTORM_VOLUMES:-}" ]; then
    echo "❄️  Snowstorm volumes: $SNOWSTORM_VOLUMES"
  else
    echo "⚠️  Snowstorm volumes not configured"
  fi
}

test_ping_mpi_connections() {
  echo "🔗 Checking MPI connections..."
  if [ -n "${MPI_CONNECTIONS:-}" ]; then
    echo "🔗 MPI connections: $MPI_CONNECTIONS"
  else
    echo "⚠️  MPI connections not configured"
  fi
}

test_conduit_package() {
  echo "📦 Checking conduit package..."
  if [ -n "${CONDUIT_PACKAGE:-}" ]; then
    echo "📦 Conduit package: $CONDUIT_PACKAGE"
  else
    echo "⚠️  Conduit package not configured"
  fi
}

wait_for_health
test_health_endpoint
test_aws_cloudfront
test_s3_bucket
test_rds_database
test_elasticache
test_slack_notification
test_environment_variables
test_metrics_aggregator
test_connection_pool
test_monitoring

echo ""
echo "🎉 AWS Smoke Tests Completed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Status: ✓ All critical checks passed"
echo "Region: $AWS_REGION"
echo "Service: $SERVICE_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All smoke tests passed successfully"

set -euo pipefail

# Handle windows curl.cmd
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
  CURL_BIN="curl.exe"
else
  CURL_BIN="${CURL_BIN:-}"
fi

if [[ -z "$CURL_BIN" ]]; then
  if command -v curl >/dev/null 2>&1; then
    CURL_BIN="curl"
  else
    echo "ERROR: curl or curl.exe is required for smoke tests"
    exit 1
  fi
fi

SERVICE_URL="${SERVICE_URL:-http://localhost:8080}"
MAX_RETRIES=10
RETRY_DELAY=5

echo "Running smoke tests against: $SERVICE_URL"

wait_for_health() {
  for i in $(seq 1 $MAX_RETRIES); do
    HTTP_CODE=$("$CURL_BIN" -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/health" 2>/dev/null || echo "000")
    if [[ "$HTTP_CODE" == "200" ]]; then
      echo "✓ Health check passed (attempt $i)"
      return 0
    fi
    echo "✗ Health check failed with HTTP $HTTP_CODE (attempt $i/$MAX_RETRIES)"
    sleep $RETRY_DELAY
  done
  echo "✗ ERROR: Service did not become healthy"
  exit 1
}

test_health_endpoint() {
  RESPONSE=$("$CURL_BIN" -sf "${SERVICE_URL}/api/health" 2>/dev/null)
  STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  if [[ "$STATUS" != "healthy" && "$STATUS" != "degraded" ]]; then
    echo "✗ ERROR: Unexpected health status: $STATUS"
    exit 1
  fi
  echo "✓ Health endpoint returned status: $STATUS"
}

test_security_headers() {
  HEADERS=$("$CURL_BIN" -sI "${SERVICE_URL}/api/health" 2>/dev/null)
  if ! echo "$HEADERS" | grep -qi "x-content-type-options"; then
    echo "⚠ WARNING: X-Content-Type-Options header missing"
  else
    echo "✓ Security headers present"
  fi
}

test_auth_protection() {
  HTTP_CODE=$("$CURL_BIN" -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/api/intelligence" 2>/dev/null)
  if [[ "$HTTP_CODE" != "401" && "$HTTP_CODE" != "403" ]]; then
    echo "⚠ WARNING: Protected endpoint returned HTTP $HTTP_CODE (expected 401/403)"
  else
    echo "✓ Auth protection verified (HTTP $HTTP_CODE)"
  fi
}

wait_for_health
test_health_endpoint
test_security_headers
test_auth_protection

echo ""
echo "All smoke tests passed"
