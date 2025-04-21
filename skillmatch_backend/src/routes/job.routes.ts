import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { JobService } from '../services/job.service';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../entities/User';

const router = Router();
const jobService = new JobService();
const jobController = new JobController(jobService);

// Public routes
router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJob);

// Protected routes (requires authentication)
router.use(authenticate);

// Recruiter only routes
router.post('/', authorize([UserRole.RECRUITER]), jobController.createJob);
router.put('/:id', authorize([UserRole.RECRUITER]), jobController.updateJob);
router.delete('/:id', authorize([UserRole.RECRUITER]), jobController.deleteJob);

export default router; 