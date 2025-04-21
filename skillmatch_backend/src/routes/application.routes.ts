import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { ApplicationService } from '../services/application.service';
import { ApplicationController } from '../controllers/application.controller';

const router = Router();
const applicationService = new ApplicationService();
const applicationController = new ApplicationController(applicationService);

// Create new application (requires login)
router.post('/', authenticate, (req, res, next) =>
  applicationController.createApplication(req, res, next)
);

// Get application details
router.get('/:id', authenticate, (req, res, next) =>
  applicationController.getApplicationDetails(req, res, next)
);

export default router;
