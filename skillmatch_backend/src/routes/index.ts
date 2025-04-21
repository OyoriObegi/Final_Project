import { Router } from 'express';
import userRoutes from './user.routes';
import jobRoutes from './job.routes';
import skillRoutes from './skill.routes';
import applicationRoutes from './application.routes';

const router: Router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API routes
router.use('/api/users', userRoutes as Router);
router.use('/api/jobs', jobRoutes as Router);               // auth handled inside route
router.use('/api/skills', skillRoutes as Router);           // auth handled inside route
router.use('/api/applications', applicationRoutes as Router); // already has auth inside

export default router;
