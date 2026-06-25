#!/usr/bin/env node

const target = process.env.LOAD_TEST_URL ?? 'http://localhost:3000/api/health';
const concurrency = Number(process.env.LOAD_TEST_CONCURRENCY ?? 100);
const requests = Number(process.env.LOAD_TEST_REQUESTS ?? 1000);
const timeoutMs = Number(process.env.LOAD_TEST_TIMEOUT_MS ?? 10000);

const latencies = [];
let failures = 0;
let completed = 0;
let scheduled = 0;

async function timedFetch() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const started = performance.now();

  try {
    const response = await fetch(target, { signal: controller.signal });
    const elapsed = performance.now() - started;
    latencies.push(elapsed);
    if (!response.ok) failures += 1;
  } catch {
    failures += 1;
  } finally {
    clearTimeout(timeout);
    completed += 1;
  }
}

async function worker() {
  while (scheduled < requests) {
    scheduled += 1;
    await timedFetch();
  }
}

function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[index];
}

const started = performance.now();
await Promise.all(Array.from({ length: concurrency }, () => worker()));
const durationSeconds = (performance.now() - started) / 1000;

const result = {
  target,
  concurrency,
  requests,
  completed,
  failures,
  successRate: `${(((completed - failures) / completed) * 100).toFixed(2)}%`,
  requestsPerSecond: Number((completed / durationSeconds).toFixed(2)),
  latencyMs: {
    p50: Number(percentile(latencies, 50).toFixed(2)),
    p95: Number(percentile(latencies, 95).toFixed(2)),
    p99: Number(percentile(latencies, 99).toFixed(2)),
  },
};

console.log(JSON.stringify(result, null, 2));

if (failures > 0) {
  process.exitCode = 1;
}
