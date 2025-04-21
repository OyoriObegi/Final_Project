import { DataSource } from 'typeorm';
import { ApplicationService } from '../src/services/application.service';
import { JobService } from '../src/services/job.service';
import { UserService } from '../src/services/user.service';
import { Application, ApplicationStatus } from '../src/entities/Application';
import { User, UserRole } from '../src/entities/User';
import { Job } from '../src/entities/Job';
import { Skill, SkillType } from '../src/entities/Skill';
import { initializeTestDataSource, clearTestDatabase, closeTestDataSource, testDataSource } from './test-utils';

describe('ApplicationService', () => {
  let applicationService: ApplicationService;
  let jobService: JobService;
  let userService: UserService;
  let recruiter: User;
  let applicant: User;
  let job: Job;
  let skill1: Skill;
  let skill2: Skill;

  beforeAll(async () => {
    await initializeTestDataSource();
    applicationService = new ApplicationService();
    jobService = new JobService();
    userService = new UserService();
  });

  beforeEach(async () => {
    await clearTestDatabase();

    // Create test users
    recruiter = await testDataSource.getRepository(User).save({
      firstName: 'Test',
      lastName: 'Recruiter',
      email: 'recruiter@test.com',
      password: 'password123',
      role: UserRole.RECRUITER
    });

    applicant = await testDataSource.getRepository(User).save({
      firstName: 'Test',
      lastName: 'Applicant',
      email: 'applicant@test.com',
      password: 'password123',
      role: UserRole.SEEKER
    });

    // Create test skills
    skill1 = await testDataSource.getRepository(Skill).save({
      name: 'JavaScript',
      slug: 'javascript',
      type: SkillType.TECHNICAL,
      metadata: {
        category: 'Programming'
      }
    });

    skill2 = await testDataSource.getRepository(Skill).save({
      name: 'TypeScript',
      slug: 'typescript',
      type: SkillType.TECHNICAL,
      metadata: {
        category: 'Programming'
      }
    });

    // Create test job
    job = await jobService.createJob({
      title: 'Software Engineer',
      description: 'Test job description',
      type: 'full-time',
      experienceLevel: 'mid',
      location: 'Remote',
      employerId: recruiter.id,
      requiredSkills: [skill1],
      preferredSkills: [skill2],
      salaryMin: 80000,
      salaryMax: 120000,
      salaryCurrency: 'USD'
    });
  });

  afterAll(async () => {
    await closeTestDataSource();
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      const applicationData = {
        jobId: job.id,
        applicantId: applicant.id,
        coverLetter: 'Test cover letter'
      };

      const application = await applicationService.createApplication(applicationData);

      expect(application).toBeDefined();
      expect(application.job.id).toBe(job.id);
      expect(application.applicant.id).toBe(applicant.id);
      expect(application.status).toBe(ApplicationStatus.PENDING);
    });

    it('should throw error if job does not exist', async () => {
      const applicationData = {
        jobId: 'non-existent-id',
        applicantId: applicant.id,
        coverLetter: 'Test cover letter'
      };

      await expect(applicationService.createApplication(applicationData)).rejects.toThrow('Job not found');
    });
  });

  describe('searchApplications', () => {
    it('should search applications with filters', async () => {
      // Create test application first
      await applicationService.createApplication({
        jobId: job.id,
        applicantId: applicant.id,
        coverLetter: 'Test cover letter'
      });

      const result = await applicationService.searchApplications({
        jobId: job.id,
        status: ApplicationStatus.PENDING
      });

      expect(result.applications).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('updateApplication', () => {
    it('should update application status', async () => {
      const application = await applicationService.createApplication({
        jobId: job.id,
        applicantId: applicant.id,
        coverLetter: 'Test cover letter'
      });

      const updatedApplication = await applicationService.updateApplication(application.id, {
        status: ApplicationStatus.ACCEPTED,
        feedback: {
          strengths: ['Good technical skills'],
          improvements: ['More experience needed'],
          notes: 'Great potential'
        }
      });

      expect(updatedApplication.status).toBe(ApplicationStatus.ACCEPTED);
      expect(updatedApplication.feedback).toBeDefined();
      expect(updatedApplication.feedback!.strengths).toContain('Good technical skills');
    });
  });
}); 