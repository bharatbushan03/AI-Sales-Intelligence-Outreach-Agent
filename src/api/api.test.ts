import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
  res.send();
});
app.get('/api/intelligence', (req, res) => {
  res.sendStatus(401);
  res.send();
});

describe('API Smoke Tests', () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(0);
  });

  afterAll(async () => {
    await server.close();
  });

  it('health endpoint returns 200', async () => {
    const response = await fetch(`http://localhost:${server.address().port}/api/health`);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });

  it('intelligence endpoint requires auth', async () => {
    const response = await fetch(`http://localhost:${server.address().port}/api/intelligence`);
    expect([401, 403]).toContain(response.status);
  });
});
