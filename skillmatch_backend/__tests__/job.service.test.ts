import { DataSource } from 'typeorm';
import { JobService } from '../src/services/job.service';
import { Job, JobType, ExperienceLevel, JobStatus } from '../src/entities/Job';
import { User, UserRole } from '../src/entities/User';
import { Skill } from '../src/entities/Skill';
import { initializeTestDataSource, clearTestDatabase, closeTestDataSource, testDataSource } from './test-utils';
import { ValidationError } from '../src/middleware/error.middleware';

describe('JobService', () => {
  let jobService: JobService;
  let employer: User;
  let requiredSkills: Skill[];
  let preferredSkills: Skill[];

  beforeAll(async () => {
    await initializeTestDataSource();
    jobService = new JobService(testDataSource);
  });

  beforeEach(async () => {
    await clearTestDatabase();

    // Create a test employer
    employer = await testDataSource.getRepository(User).save({
      firstName: 'Test',
      lastName: 'Employer',
      email: 'employer@test.com',
      password: 'password123',
      role: UserRole.EMPLOYER
    });

    // Create test skills
    requiredSkills = await testDataSource.getRepository(Skill).save([
      { name: 'JavaScript' },
      { name: 'TypeScript' }
    ]);

    preferredSkills = await testDataSource.getRepository(Skill).save([
      { name: 'React' },
      { name: 'Node.js' }
    ]);
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  describe('createJob', () => {
    it('should create a new job successfully', async () => {
      const jobData = {
        title: 'Software Engineer',
        description: 'Looking for a skilled developer',
        type: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        location: 'Remote',
        salary: '80000-100000',
        employerId: employer.id,
        requiredSkills,
        preferredSkills,
        metadata: {
          remote: true,
          benefits: ['Health Insurance', '401k'],
          requirements: ['5+ years experience'],
          responsibilities: ['Develop new features']
        }
      };

      const job = await jobService.createJob(jobData);

      expect(job).toBeDefined();
      expect(job.title).toBe(jobData.title);
      expect(job.status).toBe(JobStatus.OPEN);
      expect(job.requiredSkills).toHaveLength(2);
      expect(job.preferredSkills).toHaveLength(2);
    });

    it('should throw validation error when required fields are missing', async () => {
      const invalidJobData = {
        description: 'Missing title'
      };

      await expect(jobService.createJob(invalidJobData)).rejects.toThrow(ValidationError);
    });
  });

  describe('searchJobs', () => {
    it('should search jobs with filters', async () => {
      // Create test job first
      await jobService.createJob({
        title: 'Senior Developer',
        description: 'TypeScript expert needed',
        type: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.SENIOR,
        location: 'New York',
        employerId: employer.id,
        requiredSkills
      });

      const searchParams = {
        query: 'TypeScript',
        location: 'New York',
        type: JobType.FULL_TIME,
        experience: ExperienceLevel.SENIOR,
        page: 1,
        limit: 10
      };

      const { jobs, total } = await jobService.searchJobs(searchParams);

      expect(jobs).toHaveLength(1);
      expect(total).toBe(1);
      expect(jobs[0].title).toBe('Senior Developer');
    });
  });

  describe('updateJob', () => {
    it('should update job details', async () => {
      const job = await jobService.createJob({
        title: 'Developer',
        description: 'Initial description',
        type: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        location: 'Remote',
        employerId: employer.id
      });

      const updatedData = {
        title: 'Senior Developer',
        salary: '100000-120000'
      };

      const updatedJob = await jobService.updateJob(job.id, updatedData);

      expect(updatedJob.title).toBe(updatedData.title);
      expect(updatedJob.salary).toBe(updatedData.salary);
    });
  });

  describe('updateJobStatus', () => {
    it('should update job status', async () => {
      const job = await jobService.createJob({
        title: 'Developer',
        description: 'Test job',
        type: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        location: 'Remote',
        employerId: employer.id
      });

      const updatedJob = await jobService.updateJobStatus(job.id, JobStatus.CLOSED, employer.id);

      expect(updatedJob.status).toBe(JobStatus.CLOSED);
    });
  });
}); 