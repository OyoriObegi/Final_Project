import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { ApplicationService } from '../services/application.service';
import { ApplicationController } from '../controllers/application.controller';
import { Request, Response, NextFunction } from 'express';

const router = Router();
const applicationService = new ApplicationService();
const applicationController = new ApplicationController(applicationService);

// Create new application (requires login)
router.post('/', authenticate, (req: Request, res: Response, next: NextFunction) => {
  applicationController.createApplication(req, res, next);
});

// Get application details
router.get('/:id', authenticate, (req: Request, res: Response, next: NextFunction) => {
  applicationController.getApplicationDetails(req, res, next);
});

export default router;
