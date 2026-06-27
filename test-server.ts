// Test server for API testing
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  res.send();
});

// Auth required endpoint
app.get('/api/intelligence', (req, res) => {
  res.sendStatus(401);
  res.send();
});

app.get('/api/data', (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ message: 'Success' });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/health');
  console.log('  GET /api/intelligence (requires auth)');
  console.log('  GET /api/data (requires auth header)');
});