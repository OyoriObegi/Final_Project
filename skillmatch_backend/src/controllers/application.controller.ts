import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from '../services/application.service';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      // Add other user properties if needed
    };
  }
}

export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  async createApplication(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId, coverLetter } = req.body;
      const applicantId = req.user?.id;

      if (!jobId || !applicantId) {
        return res.status(400).json({ success: false, message: 'Job ID and user must be provided' });
      }

      const application = await this.applicationService.createApplication({
        jobId,
        applicantId,
        coverLetter
      });

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const applicationId = req.params.id;
      const application = await this.applicationService.getApplicationDetails(applicationId);

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      res.status(200).json({
        success: true,
        data: application
      });
    } catch (error) {
      next(error);
    }
  }
} 