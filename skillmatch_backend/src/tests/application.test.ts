import request from 'supertest';
import { app } from '../index';
import { Knex } from 'knex';
import { db } from '../config/database';
import { UserRepository } from '../repositories/user.repository';
import { JobRepository } from '../repositories/job.repository';
import { ApplicationRepository } from '../repositories/application.repository';
import { Application } from '../types/application';

describe('Application Endpoints', () => {
  let jobSeekerToken: string;
  let employerToken: string;
  let jobId: number;
  let applicationId: number;
  let applicationRepository: ApplicationRepository;
  let dbInstance: Knex;

  beforeAll(async () => {
    dbInstance = db as unknown as Knex;
    applicationRepository = new ApplicationRepository(dbInstance);
    await dbInstance.migrate.latest();
    await dbInstance.seed.run();

    // Get tokens for testing
    const userRepository = new UserRepository();
    const jobRepository = new JobRepository();

    // Login as job seeker
    const jobSeekerResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john.doe@example.com', password: 'password123' });
    jobSeekerToken = jobSeekerResponse.body.data.token;

    // Login as employer
    const employerResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tech.corp@example.com', password: 'password123' });
    employerToken = employerResponse.body.data.token;

    // Get a job ID for testing
    const jobs = await jobRepository.findAll({ postedBy: 'tech.corp@example.com' });
    jobId = jobs[0].id;
  });

  afterAll(async () => {
    await dbInstance.migrate.rollback();
    await dbInstance.destroy();
  });

  describe('POST /api/applications', () => {
    it('should create a new application', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send({
          job_id: jobId,
          cover_letter: 'I am excited to apply for this position.'
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.status).toBe('pending');

      applicationId = response.body.data.id;
    });

    it('should not allow duplicate applications', async () => {
      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`)
        .send({
          job_id: jobId,
          cover_letter: 'Duplicate application.'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/applications/my-applications', () => {
    it('should get user applications', async () => {
      const response = await request(app)
        .get('/api/applications/my-applications')
        .set('Authorization', `Bearer ${jobSeekerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/applications/job/:jobId', () => {
    it('should get job applications for employer', async () => {
      const response = await request(app)
        .get(`/api/applications/job/${jobId}`)
        .set('Authorization', `Bearer ${employerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('PUT /api/applications/:id/status', () => {
    it('should update application status', async () => {
      const response = await request(app)
        .put(`/api/applications/${applicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'reviewed' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.status).toBe('reviewed');
    });

    it('should not allow invalid status updates', async () => {
      const response = await request(app)
        .put(`/api/applications/${applicationId}/status`)
        .set('Authorization', `Bearer ${employerToken}`)
        .send({ status: 'invalid_status' });

      expect(response.status).toBe(400);
    });
  });
}); 