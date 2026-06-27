import { describe, it, expect } from 'vitest';

describe('API Health Check', () => {
  it('should return healthy status', async () => {
    const response = await fetch('http://localhost:8080/api/health');
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
  });
});

describe('Authentication', () => {
  it('should require authentication for intelligence endpoint', async () => {
    const response = await fetch('http://localhost:8080/api/intelligence');
    expect([401, 403]).toContain(response.status);
  });
});
