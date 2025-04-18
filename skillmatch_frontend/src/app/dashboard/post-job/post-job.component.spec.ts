import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PostJobComponent } from './post-job.component';
import { JobService } from '../../services/job.service';
import { StorageService } from '../../services/storage.service';

describe('PostJobComponent', () => {
  let component: PostJobComponent;
  let fixture: ComponentFixture<PostJobComponent>;
  let jobService: jasmine.SpyObj<JobService>;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    const jobServiceSpy = jasmine.createSpyObj('JobService', ['createJob']);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageServiceSpy.getItem.and.returnValue(JSON.stringify({ role: 'employer' }));
    
    await TestBed.configureTestingModule({
      imports: [
        PostJobComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        { provide: JobService, useValue: jobServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy }
      ]
    })
    .compileComponents();

    jobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
    fixture = TestBed.createComponent(PostJobComponent);
    component = fixture.componentInstance;
    
    // Initialize the form before detecting changes
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.jobForm).toBeDefined();
    expect(component.jobForm.get('jobTitle')).toBeDefined();
    expect(component.jobForm.get('jobDescription')).toBeDefined();
    expect(component.jobForm.get('jobType')).toBeDefined();
    expect(component.jobForm.get('experienceLevel')).toBeDefined();
    expect(component.jobForm.get('location')).toBeDefined();
    expect(component.jobForm.get('salary')).toBeDefined();
    expect(component.jobForm.get('keyResponsibilities')).toBeDefined();
    expect(component.jobForm.get('qualifications')).toBeDefined();
    expect(component.jobForm.get('benefits')).toBeDefined();
    expect(component.jobForm.get('applicationDeadline')).toBeDefined();
  });
});
