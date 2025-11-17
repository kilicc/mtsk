import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import kursiyerRoutes from './routes/kursiyer.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/kursiyer', kursiyerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MTSK API Server running on http://localhost:${PORT}`);
  console.log(`📊 Supabase connected: ${process.env.SUPABASE_URL}`);
});

