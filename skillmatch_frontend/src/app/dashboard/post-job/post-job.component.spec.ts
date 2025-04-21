import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { PostJobComponent } from './post-job.component';
import { JobService } from '@core/services/job.service';
import { StorageService } from '@core/services/storage.service';

describe('PostJobComponent', () => {
  let component: PostJobComponent;
  let fixture: ComponentFixture<PostJobComponent>;
  let jobService: jest.Mocked<JobService>;
  let storageService: jest.Mocked<StorageService>;

  beforeEach(async () => {
    const jobServiceMock = {
      createJob: jest.fn()
    };
    const storageServiceMock = {
      getItem: jest.fn().mockReturnValue(JSON.stringify({ role: 'employer' }))
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      declarations: [PostJobComponent],
      providers: [
        { provide: JobService, useValue: jobServiceMock },
        { provide: StorageService, useValue: storageServiceMock }
      ]
    }).compileComponents();

    jobService = TestBed.inject(JobService) as jest.Mocked<JobService>;
    storageService = TestBed.inject(StorageService) as jest.Mocked<StorageService>;
    fixture = TestBed.createComponent(PostJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.jobForm.get('title')?.value).toBe('');
    expect(component.jobForm.get('description')?.value).toBe('');
  });
});
