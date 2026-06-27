import express from 'express';
import cors from 'cors';

export const app = express();
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
