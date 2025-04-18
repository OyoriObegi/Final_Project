import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JobService, JobPosting, JobResponse } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recommended-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="recommended-jobs">
      <div class="container py-5">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading recommended jobs...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage" class="error-state">
          <div class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Jobs Grid -->
        <div *ngIf="!isLoading && !errorMessage" class="jobs-grid">
          <div *ngFor="let job of jobs" class="job-card">
            <div class="job-header">
              <h3>{{ job.jobTitle }}</h3>
              <span class="job-type">{{ job.jobType }}</span>
            </div>
            
            <div class="job-details">
              <p class="location">{{ job.location }}</p>
              <p class="experience">{{ job.experienceLevel }}</p>
            </div>

            <div class="job-description">
              <p>{{ job.jobDescription | slice:0:150 }}...</p>
            </div>

            <div class="job-footer">
              <div class="skills">
                <span *ngFor="let skill of job.requiredSkills" class="skill-badge">
                  {{ skill }}
                </span>
              </div>

              <div class="actions">
                <button class="btn btn-primary" [routerLink]="['/jobs', job._id]">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Jobs Found -->
        <div *ngIf="!isLoading && !errorMessage && (!jobs || jobs.length === 0)" class="no-jobs">
          <p>No recommended jobs found. Try updating your profile to get better recommendations.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .recommended-jobs {
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

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .job-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-4px);
      }

      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #212529;
        }

        .job-type {
          background-color: #e9ecef;
          color: #495057;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
      }

      .job-details {
        margin-bottom: 1rem;

        p {
          margin: 0.25rem 0;
          color: #6c757d;
          font-size: 0.875rem;
        }
      }

      .job-description {
        margin-bottom: 1rem;
        color: #495057;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .job-footer {
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;

          .skill-badge {
            background-color: #e9ecef;
            color: #495057;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
          }
        }

        .actions {
          display: flex;
          gap: 0.5rem;

          button {
            flex: 1;
          }
        }
      }
    }

    .no-jobs {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      font-size: 1.1rem;
    }

    @media (max-width: 768px) {
      .jobs-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecommendedJobsComponent implements OnInit {
  jobs: JobPosting[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRecommendedJobs();
  }

  private loadRecommendedJobs(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.jobService.getRecommendedJobs(userId).subscribe({
      next: (jobs: JobPosting[]) => {
        this.jobs = jobs;
        this.isLoading = false;
      },
      error: (error: { message?: string }) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load recommended jobs';
      }
    });
  }
} 