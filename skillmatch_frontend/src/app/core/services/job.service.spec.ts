import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobService } from './job.service';
import { Job, JobType, ExperienceLevel, JobStatus } from '../models/job.model';
import { environment } from '@env/environment';

describe('JobService', () => {
  let service: JobService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobService]
    });

    service = TestBed.inject(JobService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createJob', () => {
    it('should create a new job', () => {
      const mockJob: Partial<Job> = {
        title: 'Software Engineer',
        description: 'Full-stack developer position',
        type: JobType.FULL_TIME,
        experienceLevel: ExperienceLevel.MID,
        location: 'Remote',
        salary: 100000,
        requirements: ['JavaScript', 'TypeScript', 'Angular'],
        status: JobStatus.OPEN
      };

      service.createJob(mockJob).subscribe(job => {
        expect(job).toBeTruthy();
        expect(job.title).toBe(mockJob.title);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/jobs`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockJob, id: '1' });
    });
  });

  describe('getJobs', () => {
    it('should return an array of jobs', () => {
      const mockJobs: Partial<Job>[] = [
        {
          id: '1',
          title: 'Software Engineer',
          type: JobType.FULL_TIME
        },
        {
          id: '2',
          title: 'UI Designer',
          type: JobType.CONTRACT
        }
      ];

      service.getJobs().subscribe(jobs => {
        expect(jobs.length).toBe(2);
        expect(jobs).toEqual(mockJobs);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/jobs`);
      expect(req.request.method).toBe('GET');
      req.flush(mockJobs);
    });
  });

  describe('getJobById', () => {
    it('should return a single job by id', () => {
      const mockJob: Partial<Job> = {
        id: '1',
        title: 'Software Engineer',
        type: JobType.FULL_TIME
      };

      service.getJobById('1').subscribe(job => {
        expect(job).toBeTruthy();
        expect(job.id).toBe('1');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/jobs/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockJob);
    });
  });

  describe('updateJob', () => {
    it('should update an existing job', () => {
      const mockJob: Partial<Job> = {
        id: '1',
        title: 'Senior Software Engineer',
        type: JobType.FULL_TIME
      };

      service.updateJob('1', mockJob).subscribe(job => {
        expect(job).toBeTruthy();
        expect(job.title).toBe(mockJob.title);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/jobs/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockJob);
    });
  });

  describe('deleteJob', () => {
    it('should delete a job', () => {
      service.deleteJob('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/jobs/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('searchJobs', () => {
    it('should search jobs with filters', () => {
      const filters = {
        keyword: 'engineer',
        type: JobType.FULL_TIME,
        location: 'Remote'
      };

      const mockJobs: Partial<Job>[] = [
        {
          id: '1',
          title: 'Software Engineer',
          type: JobType.FULL_TIME,
          location: 'Remote'
        }
      ];

      service.searchJobs(filters).subscribe(jobs => {
        expect(jobs.length).toBe(1);
        expect(jobs[0].title).toContain('Engineer');
      });

      const req = httpMock.expectOne(request => 
        request.url === `${environment.apiUrl}/jobs/search` &&
        request.method === 'GET'
      );
      
      expect(req.request.params.get('keyword')).toBe(filters.keyword);
      expect(req.request.params.get('type')).toBe(filters.type);
      expect(req.request.params.get('location')).toBe(filters.location);
      
      req.flush(mockJobs);
    });
  });
}); 