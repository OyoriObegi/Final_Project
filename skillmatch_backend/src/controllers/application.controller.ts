import { Request, Response } from 'express';
import { applicationService } from '../services/application.service';
import { ApiResponse } from '../types/api';
import { Application, ApplicationStatus } from '../types/application';

const VALID_STATUSES: ApplicationStatus[] = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

export const applicationController = {
  async createApplication(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      const { job_id, cover_letter } = req.body;
      const result = await applicationService.createApplication(userId, job_id, cover_letter);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error creating application:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to create application' 
      });
    }
  },

  async getMyApplications(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      const applications = await applicationService.getUserApplications(userId);
      return res.status(200).json({ status: 'success', data: applications });
    } catch (error) {
      console.error('Error getting applications:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to get applications' 
      });
    }
  },

  async getJobApplications(req: Request, res: Response) {
    try {
      const employerId = req.user?.id;
      if (!employerId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      const jobId = parseInt(req.params.jobId);
      const applications = await applicationService.getJobApplications(jobId, employerId);
      return res.status(200).json({ status: 'success', data: applications });
    } catch (error) {
      console.error('Error getting job applications:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to get job applications' 
      });
    }
  },

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const employerId = req.user?.id;
      if (!employerId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }

      const applicationId = parseInt(req.params.id);
      const { status } = req.body;
      
      // Validate status is a valid ApplicationStatus value
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ 
          status: 'error', 
          message: `Invalid application status. Must be one of: ${VALID_STATUSES.join(', ')}` 
        });
      }

      const result = await applicationService.updateApplicationStatus(
        applicationId,
        status,
        employerId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error updating application status:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Failed to update application status' 
      });
    }
  }
}; 