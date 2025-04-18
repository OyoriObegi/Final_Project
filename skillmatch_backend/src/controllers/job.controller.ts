import { Request, Response } from 'express';
import { JobService } from '../services/job.service';
import { AuthRequest } from '../types/auth';

export class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  async createJob(req: AuthRequest, res: Response) {
    try {
      const jobData = {
        ...req.body,
        postedBy: req.user.email,
        postedDate: new Date().toISOString()
      };

      const job = await this.jobService.createJob(jobData);
      res.status(201).json({ status: 'success', data: job });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create job' });
    }
  }

  async updateJob(req: AuthRequest, res: Response) {
    try {
      const jobId = parseInt(req.params.id);
      const job = await this.jobService.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
      }

      if (job.postedBy !== req.user.email) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to update this job' });
      }

      const updatedJob = await this.jobService.updateJob(jobId, req.body);
      res.json({ status: 'success', data: updatedJob });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update job' });
    }
  }

  async deleteJob(req: AuthRequest, res: Response) {
    try {
      const jobId = parseInt(req.params.id);
      const job = await this.jobService.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
      }

      if (job.postedBy !== req.user.email) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to delete this job' });
      }

      await this.jobService.deleteJob(jobId);
      res.json({ status: 'success', message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ status: 'error', message: 'Failed to delete job' });
    }
  }

  async getJob(req: Request, res: Response) {
    try {
      const jobId = parseInt(req.params.id);
      const job = await this.jobService.getJobById(jobId);

      if (!job) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
      }

      res.json({ status: 'success', data: job });
    } catch (error) {
      console.error('Error getting job:', error);
      res.status(500).json({ status: 'error', message: 'Failed to get job' });
    }
  }

  async searchJobs(req: Request, res: Response) {
    try {
      const jobs = await this.jobService.getJobs(req.query);
      res.json({ status: 'success', data: jobs });
    } catch (error) {
      console.error('Error searching jobs:', error);
      res.status(500).json({ status: 'error', message: 'Failed to search jobs' });
    }
  }

  async getEmployerJobs(req: AuthRequest, res: Response) {
    try {
      const jobs = await this.jobService.getEmployerJobs(req.user.email);
      res.json({ status: 'success', data: jobs });
    } catch (error) {
      console.error('Error getting employer jobs:', error);
      res.status(500).json({ status: 'error', message: 'Failed to get employer jobs' });
    }
  }
} 