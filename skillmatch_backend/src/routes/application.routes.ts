import { Router } from 'express';
import { applicationController } from '../controllers/application.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createApplicationSchema,
  updateApplicationSchema,
} from '../validators/application.validator';

const router = Router();

// Protected routes for job seekers
router.post(
  '/',
  authenticate,
  authorize(['job_seeker']),
  validateRequest(createApplicationSchema),
  applicationController.createApplication
);

router.get(
  '/my-applications',
  authenticate,
  authorize(['job_seeker']),
  applicationController.getMyApplications
);

// Protected routes for employers
router.get(
  '/job/:jobId',
  authenticate,
  authorize(['employer']),
  applicationController.getJobApplications
);

router.put(
  '/:id/status',
  authenticate,
  authorize(['employer']),
  validateRequest(updateApplicationSchema),
  applicationController.updateApplicationStatus
);

export default router; 