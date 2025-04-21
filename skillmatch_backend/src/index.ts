import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import AppDataSource from './config/database';
import { config } from './config';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Start server
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Register routes
    const skillRoutes = require('./routes/skill.routes').default;
    const applicationRoutes = require('./routes/application.routes').default;
    const searchRoutes = require('./controllers/search.controller').default;
    const aiRoutes = require('./controllers/ai.controller').default;

    app.use('/api/skills', skillRoutes);
    app.use('/api/applications', applicationRoutes);
    app.use('/api/search', searchRoutes);
    app.use('/api/ai', aiRoutes);

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    });

    // Global error handler
    app.use(errorHandler);

    const port = config.port || 3000;
    const host = config.host || '0.0.0.0';

    app.listen(port, host, () => {
      console.log(`🚀 Server is running on http://${host}:${port}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
