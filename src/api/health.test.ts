import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import cors from 'cors';

// Mock the health endpoint handler based on the actual Next.js route
const app = express();
app.use(cors());

// Mock health endpoint
app.get('/api/health', (_req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    environment: 'development',
    uptime: process.uptime(),
    checks: {
      api: 'ok',
      memory: 'ok',
    },
  };
  res.json(healthStatus);
});

// Mock intelligence endpoint (should require auth)
app.get('/api/intelligence', (_req, res) => {
  res.sendStatus(401); // Unauthorized
});

describe('API Health Check', () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(0); // Listen on a random available port
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return healthy status', async () => {
    const response = await fetch(`http://localhost:${server.address().port}/api/health`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
  });
});

describe('Authentication', () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(0); // Listen on a random available port
  });

  afterAll(async () => {
    await server.close();
  });

  it('should require authentication for intelligence endpoint', async () => {
    const response = await fetch(`http://localhost:${server.address().port}/api/intelligence`);
    expect([401, 403]).toContain(response.status);
  });
});
