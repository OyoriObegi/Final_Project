import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-home">
      <div class="container py-5">
        <div class="row">
          <!-- Welcome Section -->
          <div class="col-12 mb-4">
            <h1>Welcome to Your Dashboard</h1>
            <p class="lead">Here's an overview of your job search journey</p>
          </div>

          <!-- Quick Stats -->
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Recommended Jobs</h5>
                <p class="card-text">View jobs that match your skills and experience</p>
                <a routerLink="/dashboard/recommended-jobs" class="btn btn-primary">View Recommendations</a>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">My Applications</h5>
                <p class="card-text">Track your job applications and their status</p>
                <a routerLink="/dashboard/my-applications" class="btn btn-primary">View Applications</a>
              </div>
            </div>
          </div>

          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Post a Job</h5>
                <p class="card-text">Create a new job posting for candidates</p>
                <a routerLink="/dashboard/post-job" class="btn btn-primary">Post Job</a>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Recent Activity</h5>
                <div class="activity-list">
                  <!-- Activity items will be dynamically added here -->
                  <div class="activity-item">
                    <p class="mb-0">No recent activity to show</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home {
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 2rem 0;
    }

    .card {
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease-in-out;

      &:hover {
        transform: translateY(-4px);
      }
    }

    .activity-list {
      .activity-item {
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  `]
})
export class DashboardHomeComponent { } 