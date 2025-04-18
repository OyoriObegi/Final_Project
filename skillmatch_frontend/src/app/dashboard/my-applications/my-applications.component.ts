import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="my-applications">
      <div class="container py-5">
        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading your applications...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage" class="error-state">
          <div class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
        </div>

        <!-- Applications List -->
        <div *ngIf="!isLoading && !errorMessage" class="applications-list">
          <div *ngFor="let application of applications" class="application-card">
            <div class="application-header">
              <h3>{{ application.jobTitle }}</h3>
              <span class="status-badge" [ngClass]="getStatusClass(application.status)">
                {{ application.status }}
              </span>
            </div>

            <div class="application-details">
              <p class="applied-date">
                Applied on: {{ application.appliedDate | date:'mediumDate' }}
              </p>
              <p class="company">{{ application.company }}</p>
            </div>

            <div class="application-actions">
              <button class="btn btn-outline-primary" [routerLink]="['/jobs', application.jobId]">
                View Job
              </button>
            </div>
          </div>
        </div>

        <!-- No Applications -->
        <div *ngIf="!isLoading && !errorMessage && (!applications || applications.length === 0)" class="no-applications">
          <p>You haven't applied to any jobs yet.</p>
          <button class="btn btn-primary" routerLink="/jobs">Browse Jobs</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-applications {
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

    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .application-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;

      .application-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;

        h3 {
          margin: 0;
          font-size: 1.25rem;
          color: #212529;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;

          &.pending {
            background-color: #fff3cd;
            color: #856404;
          }

          &.reviewed {
            background-color: #cce5ff;
            color: #004085;
          }

          &.accepted {
            background-color: #d4edda;
            color: #155724;
          }

          &.rejected {
            background-color: #f8d7da;
            color: #721c24;
          }
        }
      }

      .application-details {
        margin-bottom: 1rem;

        p {
          margin: 0.25rem 0;
          color: #6c757d;
          font-size: 0.875rem;

          &.company {
            font-weight: 500;
            color: #212529;
          }
        }
      }

      .application-actions {
        display: flex;
        justify-content: flex-end;
      }
    }

    .no-applications {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
      font-size: 1.1rem;

      button {
        margin-top: 1rem;
      }
    }
  `]
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  private loadApplications(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.applicationService.getUserApplications(userId).subscribe({
      next: (applications) => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load applications';
      }
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
} 