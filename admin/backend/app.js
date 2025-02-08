import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crackedRoutes from './routes/crackedRoutes.js';
import breachedRoutes from './routes/breachedRoutes.js';
import doxbinRoutes from './routes/doxbinRoutes.js';
import nulledRoutes from './routes/nulledRoutes.js';
import onniRoutes from './routes/onniRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Updated CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001' 
    : 'dashboard.localhost',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Production-only middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers.host !== 'dashboard.localhost') {
    return res.status(403).send('Forbidden');
  }
  next();
});

// API routes
app.use('/cracked', crackedRoutes);
app.use('/breached', breachedRoutes);
app.use('/doxbin', doxbinRoutes);
app.use('/nulled', nulledRoutes);
app.use('/onni', onniRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});