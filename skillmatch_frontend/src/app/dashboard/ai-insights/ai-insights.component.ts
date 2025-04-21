import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatCardModule,
    MatTooltipModule
  ],
  template: `
    <div class="ai-insights">
      <div class="container py-5">
        <h2 class="mb-4">AI Career Insights</h2>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="loading-state">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Analyzing your profile...</p>
        </div>

        <!-- Error State -->
        <div *ngIf="errorMessage" class="error-state">
          <div class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
        </div>

        <!-- AI Insights -->
        <div *ngIf="!isLoading && !errorMessage" class="row">
          <!-- Skill Match Overview -->
          <div class="col-md-6 mb-4">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Skill Match Overview</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="skill-match" *ngFor="let skill of skillMatches">
                  <div class="d-flex justify-content-between mb-1">
                    <span>{{ skill.name }}</span>
                    <span>{{ skill.score }}%</span>
                  </div>
                  <mat-progress-bar
                    mode="determinate"
                    [value]="skill.score"
                    [color]="getMatchColor(skill.score)">
                  </mat-progress-bar>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Career Path Analysis -->
          <div class="col-md-6 mb-4">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Career Path Analysis</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="career-path">
                  <h4>Current Level: {{ careerPath.currentLevel }}</h4>
                  <div class="next-steps mt-3">
                    <h5>Recommended Next Steps:</h5>
                    <ul>
                      <li *ngFor="let step of careerPath.nextSteps">
                        {{ step }}
                      </li>
                    </ul>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Skill Recommendations -->
          <div class="col-md-6 mb-4">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Recommended Skills</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="skill-recommendations">
                  <mat-chip-listbox>
                    <mat-chip *ngFor="let skill of recommendedSkills"
                             [matTooltip]="'Demand: ' + skill.demand + '%'">
                      {{ skill.name }}
                    </mat-chip>
                  </mat-chip-listbox>
                </div>
              </mat-card-content>
            </mat-card>
          </div>

          <!-- Market Trends -->
          <div class="col-md-6 mb-4">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Market Trends</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="market-trends">
                  <div *ngFor="let trend of marketTrends" class="trend-item">
                    <div class="d-flex justify-content-between">
                      <span>{{ trend.skill }}</span>
                      <span [class]="getTrendClass(trend.trend)">
                        <mat-icon>{{ getTrendIcon(trend.trend) }}</mat-icon>
                        {{ trend.percentage }}%
                      </span>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-insights {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    .loading-state {
      text-align: center;
      padding: 2rem;
    }

    mat-card {
      height: 100%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .skill-match {
      margin-bottom: 1rem;
    }

    .career-path {
      h4 {
        color: #2c3e50;
        margin-bottom: 1rem;
      }

      .next-steps {
        h5 {
          color: #34495e;
          font-size: 1rem;
        }

        ul {
          padding-left: 1.2rem;
          
          li {
            margin-bottom: 0.5rem;
            color: #576574;
          }
        }
      }
    }

    .skill-recommendations {
      mat-chip {
        margin: 0.25rem;
      }
    }

    .market-trends {
      .trend-item {
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-radius: 4px;
        background-color: #f8f9fa;

        .trend-up {
          color: #2ecc71;
        }

        .trend-down {
          color: #e74c3c;
        }

        .trend-stable {
          color: #3498db;
        }
      }
    }
  `]
})
export class AIInsightsComponent implements OnInit {
  isLoading = true;
  errorMessage = '';

  skillMatches = [
    { name: 'React.js', score: 85 },
    { name: 'Node.js', score: 75 },
    { name: 'TypeScript', score: 90 },
    { name: 'AWS', score: 60 }
  ];

  careerPath = {
    currentLevel: 'Mid-Level Frontend Developer',
    nextSteps: [
      'Learn GraphQL for advanced API integration',
      'Gain experience with microservices architecture',
      'Develop team leadership skills'
    ]
  };

  recommendedSkills = [
    { name: 'GraphQL', demand: 78 },
    { name: 'Docker', demand: 85 },
    { name: 'Kubernetes', demand: 82 },
    { name: 'Next.js', demand: 75 }
  ];

  marketTrends = [
    { skill: 'React.js', trend: 'up', percentage: 15 },
    { skill: 'Vue.js', trend: 'up', percentage: 25 },
    { skill: 'Angular', trend: 'stable', percentage: 5 },
    { skill: 'jQuery', trend: 'down', percentage: 10 }
  ];

  constructor(
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAIInsights();
  }

  private loadAIInsights(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // TODO: Implement actual API calls to get AI insights
    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
  }

  getMatchColor(score: number): string {
    if (score >= 80) return 'primary';
    if (score >= 60) return 'accent';
    return 'warn';
  }

  getTrendClass(trend: string): string {
    switch (trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-stable';
    }
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }
} 