import { JobRepository } from '../repositories/job.repository';
import { Job, JobSkill } from '../types/job';
import { JobFilters } from '../types/filters';
import { ApiResponse } from '../types/apiResponse';

export class JobService {
  private jobRepository: JobRepository;

  constructor() {
    this.jobRepository = new JobRepository();
  }

  async createJob(jobData: Omit<Job, 'id'>) {
    const job = await this.jobRepository.create(jobData);
    
    if (jobData.requiredSkills) {
      await this.jobRepository.addJobSkills(job.id, jobData.requiredSkills);
    }
    
    if (jobData.optionalSkills) {
      await this.jobRepository.addJobSkills(job.id, jobData.optionalSkills);
    }

    const jobWithSkills = await this.jobRepository.getJobSkills(job.id);
    return { ...job, ...jobWithSkills };
  }

  async updateJob(jobId: number, jobData: Partial<Job>) {
    const job = await this.jobRepository.update(jobId, jobData);
    
    if (jobData.requiredSkills || jobData.optionalSkills) {
      const skills: JobSkill[] = [
        ...(jobData.requiredSkills || []),
        ...(jobData.optionalSkills || [])
      ];
      await this.jobRepository.updateJobSkills(jobId, skills);
    }

    const jobWithSkills = await this.jobRepository.getJobSkills(jobId);
    return { ...job, ...jobWithSkills };
  }

  async getJobById(jobId: number) {
    const job = await this.jobRepository.findById(jobId);
    if (!job) return null;

    const jobSkills = await this.jobRepository.getJobSkills(jobId);
    return { ...job, ...jobSkills };
  }

  async getJobs(filters?: JobFilters) {
    return this.jobRepository.findAll(filters);
  }

  async getEmployerJobs(employerEmail: string) {
    return this.jobRepository.findAll({ postedBy: employerEmail });
  }

  async deleteJob(jobId: number) {
    return this.jobRepository.delete(jobId);
  }
}

export const jobService = new JobService(); 