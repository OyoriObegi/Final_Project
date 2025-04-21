import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApplicationService } from './application.service';
import { Application, ApplicationStatus } from '../models/application.model';
import { environment } from '@env/environment';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApplicationService]
    });

    service = TestBed.inject(ApplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createApplication', () => {
    it('should create a new application', () => {
      const mockApplication: Partial<Application> = {
        jobId: '1',
        coverLetter: 'I am interested in this position',
        status: ApplicationStatus.PENDING
      };

      service.createApplication(mockApplication).subscribe(application => {
        expect(application).toBeTruthy();
        expect(application.status).toBe(ApplicationStatus.PENDING);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/applications`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockApplication, id: '1' });
    });
  });

  describe('getApplications', () => {
    it('should return an array of applications', () => {
      const mockApplications: Partial<Application>[] = [
        {
          id: '1',
          jobId: '1',
          status: ApplicationStatus.PENDING
        },
        {
          id: '2',
          jobId: '2',
          status: ApplicationStatus.ACCEPTED
        }
      ];

      service.getApplications().subscribe(applications => {
        expect(applications.length).toBe(2);
        expect(applications).toEqual(mockApplications);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/applications`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApplications);
    });
  });

  describe('getApplicationById', () => {
    it('should return a single application by id', () => {
      const mockApplication: Partial<Application> = {
        id: '1',
        jobId: '1',
        status: ApplicationStatus.PENDING
      };

      service.getApplicationById('1').subscribe(application => {
        expect(application).toBeTruthy();
        expect(application.id).toBe('1');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/applications/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApplication);
    });
  });

  describe('updateApplication', () => {
    it('should update an existing application', () => {
      const mockApplication: Partial<Application> = {
        id: '1',
        status: ApplicationStatus.ACCEPTED,
        feedback: 'Great fit for the position'
      };

      service.updateApplication('1', mockApplication).subscribe(application => {
        expect(application).toBeTruthy();
        expect(application.status).toBe(ApplicationStatus.ACCEPTED);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/applications/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockApplication);
    });
  });

  describe('deleteApplication', () => {
    it('should delete an application', () => {
      service.deleteApplication('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/applications/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('searchApplications', () => {
    it('should search applications with filters', () => {
      const filters = {
        jobId: '1',
        status: ApplicationStatus.PENDING
      };

      const mockApplications: Partial<Application>[] = [
        {
          id: '1',
          jobId: '1',
          status: ApplicationStatus.PENDING
        }
      ];

      service.searchApplications(filters).subscribe(applications => {
        expect(applications.length).toBe(1);
        expect(applications[0].status).toBe(ApplicationStatus.PENDING);
      });

      const req = httpMock.expectOne(request => 
        request.url === `${environment.apiUrl}/applications/search` &&
        request.method === 'GET'
      );
      
      expect(req.request.params.get('jobId')).toBe(filters.jobId);
      expect(req.request.params.get('status')).toBe(filters.status);
      
      req.flush(mockApplications);
    });
  });
}); 