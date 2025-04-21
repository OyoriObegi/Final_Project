import AppDataSource from '../config/database';
import { Application, ApplicationStatus } from '../entities/Application';
import { User } from '../entities/User';
import { Job } from '../entities/Job';
import { BaseService } from './base.service';
import { ValidationError, NotFoundError } from '../middleware/error.middleware';

interface CreateApplicationDTO {
  jobId: string;
  applicantId: string;
  coverLetter?: string;
}

interface UpdateApplicationDTO {
  status?: ApplicationStatus;
  feedback?: {
    strengths?: string[];
    improvements?: string[];
    notes?: string;
  };
  interviews?: {
    scheduledDate: Date;
    type: string;
    status: string;
    feedback?: string;
  }[];
}

interface ApplicationSearchParams {
  jobId?: string;
  applicantId?: string;
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

export class ApplicationService extends BaseService<Application> {
  constructor(dataSource = AppDataSource) {
    super(dataSource.getRepository(Application));
  }

  async createApplication(data: CreateApplicationDTO): Promise<Application> {
    const userRepository = this.repository.manager.getRepository(User);
    const jobRepository = this.repository.manager.getRepository(Job);

    const [applicant, job] = await Promise.all([
      userRepository.findOne({ where: { id: data.applicantId } }),
      jobRepository.findOne({
        where: { id: data.jobId },
        relations: ['applications']
      })
    ]);

    if (!applicant) {
      throw new NotFoundError('Applicant not found');
    }

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Check if user has already applied
    const existingApplication = await this.findOne({
      applicant: { id: data.applicantId },
      job: { id: data.jobId }
    });

    if (existingApplication) {
      throw new ValidationError('You have already applied for this job');
    }

    const application = await this.create({
      ...data,
      applicant,
      job,
      status: ApplicationStatus.PENDING,
      matchScore: await this.calculateMatchScore(applicant, job)
    });

    // Perform AI analysis
    application.aiAnalysis = await this.performAIAnalysis(application);

    return this.repository.save(application);
  }

  async updateApplication(
    applicationId: string,
    data: UpdateApplicationDTO
  ): Promise<Application> {
    const application = await this.findById(applicationId);

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (data.status) {
      application.lastStatusChangeAt = new Date();
    }

    return this.update(applicationId, data);
  }

  async searchApplications(
    params: ApplicationSearchParams
  ): Promise<{ applications: Application[]; total: number }> {
    const { jobId, applicantId, status, page = 1, limit = 10 } = params;

    const queryBuilder = this.repository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.applicant', 'applicant')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.requiredSkills', 'requiredSkills')
      .leftJoinAndSelect('job.preferredSkills', 'preferredSkills');

    if (jobId) {
      queryBuilder.andWhere('job.id = :jobId', { jobId });
    }

    if (applicantId) {
      queryBuilder.andWhere('applicant.id = :applicantId', { applicantId });
    }

    if (status) {
      queryBuilder.andWhere('application.status = :status', { status });
    }

    const [applications, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { applications, total };
  }

  async getApplicationDetails(applicationId: string): Promise<Application> {
    const application = await this.repository.findOne({
      where: { id: applicationId },
      relations: [
        'applicant',
        'job',
        'job.requiredSkills',
        'job.preferredSkills',
        'job.recruiter'
      ]
    });

    if (!application) {
      throw new NotFoundError('Application not found');
    }

    return application;
  }

  private async calculateMatchScore(applicant: User, job: Job): Promise<number> {
    // TODO: Implement AI-based match score calculation
    // This should consider:
    // - Required skills match
    // - Preferred skills match
    // - Experience level match
    // - Portfolio projects relevance
    // - Previous similar roles
    return 0;
  }

  private async performAIAnalysis(application: Application): Promise<{
    skillMatch: number;
    experienceMatch: number;
    cultureFit: number;
    recommendations: string[];
    missingSkills: string[];
  }> {
    // TODO: Implement AI-based application analysis
    // This should analyze:
    // - Skills gap analysis
    // - Experience relevance
    // - Cultural fit indicators
    // - Career progression alignment
    return {
      skillMatch: 0,
      experienceMatch: 0,
      cultureFit: 0,
      recommendations: [],
      missingSkills: []
    };
  }

  async getApplicationStatistics(jobId: string): Promise<{
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    averageMatchScore: number;
  }> {
    const applications = await this.repository.find({
      where: { job: { id: jobId } }
    });

    const byStatus = Object.values(ApplicationStatus).reduce(
      (acc, status) => ({ ...acc, [status]: 0 }),
      {} as Record<ApplicationStatus, number>
    );

    let totalMatchScore = 0;

    applications.forEach(app => {
      byStatus[app.status]++;
      if (app.matchScore) {
        totalMatchScore += app.matchScore;
      }
    });

    return {
      total: applications.length,
      byStatus,
      averageMatchScore:
        applications.length > 0 ? totalMatchScore / applications.length : 0
    };
  }
} 