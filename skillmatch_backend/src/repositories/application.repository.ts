import { Knex } from 'knex';
import { Application, ApplicationWithJob, ApplicationWithUser } from '../types/application';

export class ApplicationRepository {
  private db: Knex;

  constructor(db: Knex) {
    this.db = db;
  }

  async create(applicationData: Omit<Application, 'id' | 'created_at' | 'updated_at'>) {
    const [application] = await this.db('applications')
      .insert({
        ...applicationData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return application;
  }

  async findById(id: number) {
    return this.db('applications')
      .where({ id })
      .first();
  }

  async update(id: number, applicationData: Partial<Application>) {
    const [application] = await this.db('applications')
      .where({ id })
      .update({
        ...applicationData,
        updated_at: new Date(),
      })
      .returning('*');
    return application;
  }

  async getUserApplications(userId: number): Promise<ApplicationWithJob[]> {
    return this.db('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .where('applications.user_id', userId)
      .select(
        'applications.*',
        'jobs.title',
        'jobs.company_name',
        'jobs.location',
        'jobs.job_type',
        'jobs.experience_level'
      )
      .orderBy('applications.created_at', 'desc');
  }

  async getJobApplications(jobId: number, employerId: number): Promise<ApplicationWithUser[]> {
    return this.db('applications')
      .join('jobs', 'applications.job_id', 'jobs.id')
      .join('users', 'applications.user_id', 'users.id')
      .where('applications.job_id', jobId)
      .where('jobs.employer_id', employerId)
      .select(
        'applications.*',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.location'
      )
      .orderBy('applications.created_at', 'desc');
  }

  async verifyApplicationOwnership(applicationId: number, userId: number) {
    const application = await this.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }
    if (application.user_id !== userId) {
      throw new Error('Not authorized to access this application');
    }
    return application;
  }

  async verifyJobOwnership(jobId: number, employerId: number) {
    const job = await this.db('jobs')
      .where({ id: jobId, employer_id: employerId })
      .first();
    if (!job) {
      throw new Error('Job not found or not authorized');
    }
    return job;
  }
} 