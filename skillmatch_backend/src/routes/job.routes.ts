import { Router } from 'express';
import { JobController } from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const jobController = new JobController();

// Public routes
router.get('/search', jobController.searchJobs.bind(jobController));
router.get('/:id', jobController.getJob.bind(jobController));

// Protected routes
router.use(authenticate);
router.post('/', authorize(['employer']), jobController.createJob.bind(jobController));
router.put('/:id', authorize(['employer']), jobController.updateJob.bind(jobController));
router.delete('/:id', authorize(['employer']), jobController.deleteJob.bind(jobController));
router.get('/employer/jobs', authorize(['employer']), jobController.getEmployerJobs.bind(jobController));

export default router; 