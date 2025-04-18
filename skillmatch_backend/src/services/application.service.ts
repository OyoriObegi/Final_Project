import { ApplicationRepository } from '../repositories/application.repository';
import { JobRepository } from '../repositories/job.repository';
import { Application, ApplicationStatus } from '../types/application';
import { ApiResponse } from '../types/api';

export class ApplicationService {
  private applicationRepository: ApplicationRepository;
  private jobRepository: JobRepository;

  constructor() {
    this.applicationRepository = new ApplicationRepository();
    this.jobRepository = new JobRepository();
  }

  async createApplication(userId: number, jobId: number, coverLetter: string): Promise<ApiResponse<Application>> {
    try {
      const application = await this.applicationRepository.create({
        user_id: userId,
        job_id: jobId,
        cover_letter: coverLetter,
        status: 'pending' as ApplicationStatus
      });

      return {
        status: 'success',
        data: application
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to create application'
      };
    }
  }

  async getUserApplications(userId: number): Promise<ApiResponse<Application[]>> {
    try {
      const applications = await this.applicationRepository.find({ user_id: userId });
      return {
        status: 'success',
        data: applications
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to get applications'
      };
    }
  }

  async getJobApplications(jobId: number, employerId: number): Promise<ApiResponse<Application[]>> {
    try {
      const applications = await this.applicationRepository.find({ job_id: jobId });
      return {
        status: 'success',
        data: applications
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to get job applications'
      };
    }
  }

  async updateApplicationStatus(
    applicationId: number,
    status: ApplicationStatus,
    employerId: number
  ): Promise<ApiResponse<Application>> {
    try {
      const application = await this.applicationRepository.findById(applicationId);
      if (!application) {
        return {
          status: 'error',
          error: {
            code: 'NOT_FOUND',
            message: 'Application not found'
          }
        };
      }

      const updatedApplication = await this.applicationRepository.update(applicationId, { status });
      return {
        status: 'success',
        data: updatedApplication
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to update application status'
      };
    }
  }

  async findByUserAndJob(userId: number, jobId: number): Promise<Application | null> {
    return this.applicationRepository.find({ user_id: userId, job_id: jobId }).then(apps => apps[0] || null);
  }

  async applyForJob(userId: number, jobId: number, coverLetter: string): Promise<ApiResponse<Application>> {
    try {
      // Check if job exists and is active
      const job = await this.jobRepository.findById(jobId);
      if (!job) {
        return {
          status: 'error',
          error: {
            code: 'NOT_FOUND',
            message: 'Job not found'
          }
        };
      }
      if (job.status !== 'active') {
        return {
          status: 'error',
          error: {
            code: 'INVALID_STATUS',
            message: 'Job is not active'
          }
        };
      }

      // Check if user has already applied
      const existingApplication = await this.findByUserAndJob(userId, jobId);
      if (existingApplication) {
        return {
          status: 'error',
          error: {
            code: 'DUPLICATE',
            message: 'You have already applied for this job'
          }
        };
      }

      // Create application
      const application = await this.applicationRepository.create({
        user_id: userId,
        job_id: jobId,
        cover_letter: coverLetter,
        status: 'pending' as ApplicationStatus,
      });

      return {
        status: 'success',
        data: application
      };
    } catch (error) {
      console.error('Error in applyForJob:', error);
      return {
        status: 'error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to apply for job'
        }
      };
    }
  }

  async getApplicationDetails(applicationId: number, userId: number): Promise<ApiResponse<Application>> {
    try {
      const application = await this.applicationRepository.findById(applicationId);
      if (!application) {
        return {
          status: 'error',
          error: {
            code: 'NOT_FOUND',
            message: 'Application not found'
          }
        };
      }

      // Verify access
      const job = await this.jobRepository.findById(application.job_id);
      if (application.user_id !== userId && job.employer_id !== userId) {
        return {
          status: 'error',
          error: {
            code: 'UNAUTHORIZED',
            message: 'Unauthorized to view this application'
          }
        };
      }

      return {
        status: 'success',
        data: application
      };
    } catch (error) {
      console.error('Error in getApplicationDetails:', error);
      return {
        status: 'error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get application details'
        }
      };
    }
  }
}

export const applicationService = new ApplicationService(); 