#!/usr/bin/env node
// Simple load test implementation
import https from 'https';
import http from 'http';
import process from 'process';

const LOAD_TEST_URL = process.env.LOAD_TEST_URL || 'http://localhost:8080/api/health';
const LOAD_TEST_CONCURRENCY = parseInt(process.env.LOAD_TEST_CONCURRENCY || '25');
const LOAD_TEST_REQUESTS = parseInt(process.env.LOAD_TEST_REQUESTS || '250');

class LoadTester {
  constructor(url, concurrency, requests) {
    this.url = url;
    this.concurrency = concurrency;
    this.requests = requests;
    this.completed = 0;
    this.failed = 0;
    this.success = 0;
  }

  async run() {
    // Create a pool of workers
    const workers = [];
    for (let i = 0; i < this.concurrency; i++) {
      workers.push(this.runWorker());
    }

    // Start all workers
    await Promise.all(workers);

    // Print results
    const total = this.completed + this.failed;
    const successRate = total > 0 ? ((this.success / total) * 100).toFixed(2) : 0;
    const averageTime = total > 0 ? ((this.runningTime / total) * 1000).toFixed(2) : 0;

    console.log('\n===== LOAD TEST RESULTS =====');
    console.log(`Total Requests: ${total}`);
    console.log(`Successful: ${this.success}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Success Rate: ${successRate}%`);
    console.log(`Average Response Time: ${averageTime}ms`);
    console.log('============================\n');

    process.exit(this.failed > 0 ? 1 : 0);
  }

  async runWorker() {
    const startTime = Date.now();
    let completed = 0;
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (completed >= this.requests || this.completed >= this.requests) {
          clearInterval(interval);
          resolve();
          return;
        }
        this.makeRequest().then((success) => {
          if (success) {
            this.success++;
          }
          completed++;
          this.completed++;
          if (this.completed >= this.requests) {
            resolve();
          }
        });
      }, 100);
    });
    this.runningTime = this.runningTime || 0;
    this.runningTime += (Date.now() - startTime) / this.concurrency;
  }

  async makeRequest() {
    return new Promise((resolve) => {
      const protocol = this.url.startsWith('https') ? https : http;

      const options = {
        host: new URL(this.url).hostname,
        port: new URL(this.url).port,
        path: new URL(this.url).pathname,
        method: 'GET',
        timeout: 10000,
      };

      const req = protocol.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true);
        } else {
          this.failed++;
          resolve(false);
        }
      });

      req.on('timeout', () => {
        this.failed++;
        resolve(false);
      });

      req.on('error', () => {
        this.failed++;
        resolve(false);
      });

      req.end();
    });
  }
}

// Run the load test
const loader = new LoadTester(LOAD_TEST_URL, LOAD_TEST_CONCURRENCY, LOAD_TEST_REQUESTS);
loader.run().catch((error) => {
  console.error('Load test failed:', error);
  process.exit(1);
});