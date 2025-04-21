import { User, UserRole, UserStatus } from '../../src/entities/User';
import { Job, JobType, ExperienceLevel, JobStatus } from '../../src/entities/Job';
import { Skill } from '../../src/entities/Skill';
import { Application, ApplicationStatus } from '../../src/entities/Application';
import { DataSource } from 'typeorm';
import AppDataSource from '../../src/config/database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export const createTestDataSource = async (): Promise<DataSource> => {
  try {
    await AppDataSource.initialize();
    return AppDataSource;
  } catch (error) {
    console.error('Error during test database initialization:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  await AppDataSource.manager.delete(Application, {});
  await AppDataSource.manager.delete(Job, {});
  await AppDataSource.manager.delete(User, {});
  await AppDataSource.manager.delete(Skill, {});
};

export const createTestUser = async (overrides: Partial<User> = {}) => {
  const user = new User();
  user.id = uuidv4();
  user.email = `test${Math.random()}@example.com`;
  user.password = await bcrypt.hash('testpassword123', 10);
  user.firstName = 'Test';
  user.lastName = 'User';
  user.role = overrides.role ?? UserRole.SEEKER;
  user.status = UserStatus.ACTIVE;
  user.createdAt = new Date();
  user.updatedAt = new Date();
  Object.assign(user, overrides);
  
  return await AppDataSource.manager.save(user);
};

export const createTestSkill = async (name: string) => {
  const skill = new Skill();
  skill.id = uuidv4();
  skill.name = name;
  skill.createdAt = new Date();
  skill.updatedAt = new Date();
  return await AppDataSource.manager.save(skill);
};

export const createTestJob = async (employer: User, overrides: Partial<Job> = {}) => {
  const job = new Job();
  job.id = uuidv4();
  job.title = 'Test Job';
  job.description = 'Test job description';
  job.type = 'full-time';
  job.experienceLevel = 'mid';
  job.location = 'Test Location';
  job.employer = employer;
  job.employerId = employer.id;
  job.status = JobStatus.OPEN;
  job.salaryMin = 50000;
  job.salaryMax = 100000;
  job.salaryCurrency = 'USD';
  job.metadata = {
    requirements: ['requirement1', 'requirement2']
  };
  job.requiredSkills = [];
  job.preferredSkills = [];
  job.createdAt = new Date();
  job.updatedAt = new Date();
  Object.assign(job, overrides);
  
  return await AppDataSource.manager.save(job);
};

export const createTestApplication = async (job: Job, applicant: User, overrides: Partial<Application> = {}) => {
  const application = new Application();
  application.id = uuidv4();
  application.job = job;
  application.applicant = applicant;
  application.status = ApplicationStatus.PENDING;
  application.createdAt = new Date();
  application.updatedAt = new Date();
  Object.assign(application, overrides);
  
  return await AppDataSource.manager.save(application);
};

export const cleanupTestData = async () => {
  await AppDataSource.manager.delete(Application, {});
  await AppDataSource.manager.delete(Job, {});
  await AppDataSource.manager.delete(User, {});
  await AppDataSource.manager.delete(Skill, {});
};

export const setupTestDatabase = async () => {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error('Error during test database initialization:', error);
    throw error;
  }
};

export const closeTestDatabase = async () => {
  try {
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during test database cleanup:', error);
    throw error;
  }
}; 