import { Router } from 'express';
import userRoutes from './user.routes';
import jobRoutes from './job.routes';
import skillRoutes from './skill.routes';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API routes
router.use('/api/users', userRoutes);
router.use('/api/jobs', authenticate, jobRoutes);
router.use('/api/skills', authenticate, skillRoutes);

export default router; 