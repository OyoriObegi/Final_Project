import { getRepository, In, Like } from 'typeorm';
import { Job, JobType, ExperienceLevel, JobStatus } from '../entities/Job';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import { BaseService } from './base.service';
import { NotFoundError } from '../middleware/error.middleware';
import { JobApplication, ApplicationStatus } from '../entities/JobApplication';
import { Repository } from 'typeorm';
import { ValidationError } from '../middleware/error.middleware';
import AppDataSource from '../config/database';

interface CreateJobDTO {
  title: string;
  description: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  salary?: string;
  recruiterId: string;
  requiredSkillIds: string[];
  preferredSkillIds?: string[];
  metadata?: {
    remote?: boolean;
    benefits?: string[];
    requirements?: string[];
    responsibilities?: string[];
  };
  expiresAt?: Date;
}

interface UpdateJobDTO extends Partial<CreateJobDTO> {}

interface JobSearchParams {
  query?: string;
  location?: string;
  type?: string;
  experience?: string;
  salary?: number;
  page?: number;
  limit?: number;
}

export class JobService extends BaseService<Job> {
  private jobApplicationRepository: Repository<JobApplication>;

  constructor(dataSource = AppDataSource) {
    super(dataSource.getRepository(Job));
    this.jobApplicationRepository = dataSource.getRepository(JobApplication);
  }

  async createJob(jobData: Partial<Job>): Promise<Job> {
    if (!jobData.title || !jobData.description || !jobData.employerId) {
      throw new ValidationError('Missing required job fields');
    }

    const job = this.repository.create({
      ...jobData,
      status: JobStatus.OPEN,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.repository.save(job);
  }

  async updateJob(jobId: string, data: UpdateJobDTO): Promise<Job> {
    const job = await this.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (data.requiredSkillIds || data.preferredSkillIds) {
      const skillRepository = getRepository(Skill);

      if (data.requiredSkillIds) {
        job.requiredSkills = await skillRepository.findBy({ id: In(data.requiredSkillIds) });
      }

      if (data.preferredSkillIds) {
        job.preferredSkills = await skillRepository.findBy({ id: In(data.preferredSkillIds) });
      }
    }

    Object.assign(job, data);
    return this.repository.save(job);
  }

  async searchJobs(params: JobSearchParams): Promise<{ jobs: Job[]; total: number }> {
    const { query, location, type, experience, salary, page = 1, limit = 10 } = params;
    
    const queryBuilder = this.repository.createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.OPEN });

    if (query) {
      queryBuilder.andWhere(
        '(job.title ILIKE :query OR job.description ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    if (location) {
      queryBuilder.andWhere('job.location ILIKE :location', { location: `%${location}%` });
    }

    if (type) {
      queryBuilder.andWhere('job.type = :type', { type });
    }

    if (experience) {
      queryBuilder.andWhere('job.experience = :experience', { experience });
    }

    if (salary) {
      queryBuilder.andWhere('job.salary >= :salary', { salary });
    }

    const [jobs, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { jobs, total };
  }

  async getEmployerJobs(employerId: string): Promise<Job[]> {
    return this.repository.find({
      where: { employerId },
      order: { createdAt: 'DESC' }
    });
  }

  async updateJobStatus(jobId: string, status: JobStatus, employerId: string): Promise<Job> {
    const job = await this.repository.findOne({
      where: { id: jobId, employerId }
    });

    if (!job) {
      throw new ValidationError('Job not found or unauthorized');
    }

    if (!Object.values(JobStatus).includes(status)) {
      throw new ValidationError('Invalid job status');
    }

    job.status = status;
    job.updatedAt = new Date();

    return this.repository.save(job);
  }

  async getJobApplications(jobId: string, employerId: string): Promise<JobApplication[]> {
    const job = await this.repository.findOne({
      where: { id: jobId, employerId }
    });

    if (!job) {
      throw new ValidationError('Job not found or unauthorized');
    }

    return this.jobApplicationRepository.find({
      where: { jobId },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async getRecommendedJobs(userId: string): Promise<Job[]> {
    // In a real implementation, this would use a recommendation algorithm
    // For now, return recent open jobs
    return this.repository.find({
      where: { status: JobStatus.OPEN },
      order: { createdAt: 'DESC' },
      take: 10
    });
  }

  async applyToJob(jobId: string, userId: string, applicationData: Partial<JobApplication>): Promise<JobApplication> {
    const job = await this.repository.findOne({
      where: { id: jobId, status: JobStatus.OPEN }
    });

    if (!job) {
      throw new ValidationError('Job not found or not open for applications');
    }

    // Check if user has already applied
    const existingApplication = await this.jobApplicationRepository.findOne({
      where: { jobId, userId }
    });

    if (existingApplication) {
      throw new ValidationError('You have already applied to this job');
    }

    const application = this.jobApplicationRepository.create({
      ...applicationData,
      jobId,
      userId,
      status: ApplicationStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.jobApplicationRepository.save(application);
  }

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus, employerId: string): Promise<JobApplication> {
    const application = await this.jobApplicationRepository.findOne({
      where: { id: applicationId },
      relations: ['job']
    });

    if (!application || application.job.employerId !== employerId) {
      throw new ValidationError('Application not found or unauthorized');
    }

    if (!Object.values(ApplicationStatus).includes(status)) {
      throw new ValidationError('Invalid application status');
    }

    application.status = status;
    application.updatedAt = new Date();

    return this.jobApplicationRepository.save(application);
  }

  async getUserApplications(userId: string): Promise<JobApplication[]> {
    return this.jobApplicationRepository.find({
      where: { userId },
      relations: ['job'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByEmployer(employerId: string): Promise<Job[]> {
    return this.repository.find({
      where: { employer: { id: employerId } },
      relations: ['employer', 'skills']
    });
  }
} 