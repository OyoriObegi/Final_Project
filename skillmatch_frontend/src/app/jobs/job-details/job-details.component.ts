import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, JobPosting } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { ApplicationService, JobApplication, ApplicationStatus } from '../../services/application.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="job-details">
      <div class="container py-5">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading job details...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage" class="error-state">
          <div class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Job Details -->
        <div *ngIf="!isLoading && !errorMessage && job" class="job-details-card">
          <div class="job-header">
            <h1>{{ job.jobTitle }}</h1>
            <div class="job-meta">
              <span class="job-type">{{ job.jobType }}</span>
              <span class="location">{{ job.location }}</span>
              <span class="experience">{{ job.experienceLevel }}</span>
            </div>
          </div>

          <div class="job-content">
            <div class="job-description">
              <h2>Job Description</h2>
              <p>{{ job.jobDescription }}</p>
            </div>

            <div class="job-requirements">
              <h2>Required Skills</h2>
              <div class="skills">
                <span *ngFor="let skill of job.requiredSkills" class="skill-badge">
                  {{ skill }}
                </span>
              </div>
            </div>

            <div class="job-actions">
              <button *ngIf="isAuthenticated$ | async" 
                      class="btn btn-primary" 
                      (click)="applyForJob()">
                Apply Now
              </button>
              <button *ngIf="!(isAuthenticated$ | async)" 
                      class="btn btn-primary" 
                      (click)="navigateToLogin()">
                Login to Apply
              </button>
              <button class="btn btn-outline-primary" 
                      (click)="goBack()">
                Back to Jobs
              </button>
            </div>
          </div>
        </div>

        <!-- Application Form Modal -->
        <div *ngIf="showApplicationForm" class="modal show d-block" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Apply for {{ job?.jobTitle }}</h5>
                <button type="button" class="btn-close" (click)="cancelApplication()"></button>
              </div>
              <div class="modal-body">
                <div *ngIf="applicationError" class="alert alert-danger" role="alert">
                  {{ applicationError }}
                </div>

                <form (ngSubmit)="submitApplication()">
                  <div class="mb-3">
                    <label for="coverLetter" class="form-label">Cover Letter</label>
                    <textarea class="form-control" 
                              id="coverLetter" 
                              rows="5" 
                              [(ngModel)]="application.coverLetter" 
                              name="coverLetter"
                              required></textarea>
                  </div>

                  <div class="mb-3">
                    <label for="resume" class="form-label">Resume</label>
                    <textarea class="form-control" 
                              id="resume" 
                              rows="5" 
                              [(ngModel)]="application.resume" 
                              name="resume"
                              required></textarea>
                    <div class="form-text">
                      Please provide your resume in text format. You can copy and paste the content here.
                    </div>
                  </div>

                  <div class="d-flex justify-content-end">
                    <button type="button" 
                            class="btn btn-outline-secondary me-2" 
                            (click)="cancelApplication()">
                      Cancel
                    </button>
                    <button type="submit" 
                            class="btn btn-primary" 
                            [disabled]="isSubmitting">
                      <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div *ngIf="showApplicationForm" class="modal-backdrop show"></div>
      </div>
    </div>
  `,
  styles: [`
    .job-details {
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 2rem 0;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;

      .spinner-border {
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;
      }

      p {
        color: #6c757d;
        font-size: 1.1rem;
      }
    }

    .error-state {
      padding: 1rem;
      margin-bottom: 2rem;
    }

    .job-details-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 2rem;

      .job-header {
        margin-bottom: 2rem;

        h1 {
          color: #212529;
          margin-bottom: 1rem;
        }

        .job-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;

          span {
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.875rem;
            font-weight: 500;

            &.job-type {
              background-color: #e9ecef;
              color: #495057;
            }

            &.location {
              background-color: #e3f2fd;
              color: #0d6efd;
            }

            &.experience {
              background-color: #f8f9fa;
              color: #6c757d;
              border: 1px solid #dee2e6;
            }
          }
        }
      }

      .job-content {
        .job-description {
          margin-bottom: 2rem;

          h2 {
            color: #212529;
            margin-bottom: 1rem;
            font-size: 1.25rem;
          }

          p {
            color: #495057;
            line-height: 1.6;
          }
        }

        .job-requirements {
          margin-bottom: 2rem;

          h2 {
            color: #212529;
            margin-bottom: 1rem;
            font-size: 1.25rem;
          }

          .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;

            .skill-badge {
              background-color: #e9ecef;
              color: #495057;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              font-size: 0.875rem;
            }
          }
        }

        .job-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;

          button {
            padding: 0.75rem 1.5rem;
          }
        }
      }
    }

    .modal {
      .modal-dialog {
        max-width: 800px;
      }

      .modal-content {
        border: none;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        .modal-header {
          border-bottom: 1px solid #dee2e6;
          padding: 1.5rem;

          .modal-title {
            margin: 0;
            font-size: 1.25rem;
            color: #212529;
          }
        }

        .modal-body {
          padding: 1.5rem;

          .form-label {
            font-weight: 500;
            color: #212529;
          }

          .form-control {
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 0.75rem;

            &:focus {
              border-color: #0d6efd;
              box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
            }
          }

          .form-text {
            color: #6c757d;
            font-size: 0.875rem;
            margin-top: 0.5rem;
          }
        }
      }
    }

    @media (max-width: 768px) {
      .job-details-card {
        padding: 1.5rem;

        .job-header {
          .job-meta {
            flex-direction: column;
            gap: 0.5rem;
          }
        }

        .job-content {
          .job-actions {
            flex-direction: column;

            button {
              width: 100%;
            }
          }
        }
      }
    }
  `]
})
export class JobDetailsComponent implements OnInit {
  job: JobPosting | null = null;
  isLoading = true;
  errorMessage = '';
  showApplicationForm = false;
  isSubmitting = false;
  applicationError = '';
  isAuthenticated$!: Observable<boolean>;

  application: Omit<JobApplication, '_id'> = {
    jobId: '',
    applicantId: '',
    coverLetter: '',
    resume: '',
    status: 'pending' as ApplicationStatus,
    appliedDate: new Date().toISOString()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private authService: AuthService,
    private applicationService: ApplicationService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.loadJobDetails();
  }

  private loadJobDetails(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      this.errorMessage = 'No job ID provided';
      this.isLoading = false;
      return;
    }

    this.jobService.getJobById(jobId).subscribe({
      next: (job) => {
        this.job = job;
        this.application.jobId = job._id;
        const userId = this.authService.getUserId();
        if (userId) {
          this.application.applicantId = userId;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load job details';
        this.isLoading = false;
        console.error('Error loading job details:', error);
      }
    });
  }

  applyForJob(): void {
    if (!this.job) return;

    this.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.navigateToLogin();
        return;
      }
      this.showApplicationForm = true;
    });
  }

  submitApplication(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.application.applicantId = userId;
    if (!this.job || !this.application.coverLetter || !this.application.resume) {
      this.applicationError = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.applicationError = '';

    this.applicationService.applyForJob(this.application).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showApplicationForm = false;
        this.router.navigate(['/dashboard/my-applications']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.applicationError = 'Failed to submit application. Please try again.';
        console.error('Error submitting application:', error);
      }
    });
  }

  cancelApplication(): void {
    this.showApplicationForm = false;
    const userId = this.authService.getUserId();
    this.application = {
      jobId: this.job?._id || '',
      applicantId: userId || '',
      coverLetter: '',
      resume: '',
      status: 'pending' as ApplicationStatus,
      appliedDate: new Date().toISOString()
    };
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: this.router.url }
    });
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
} 