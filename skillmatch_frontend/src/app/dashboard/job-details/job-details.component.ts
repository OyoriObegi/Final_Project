import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, JobPosting } from '../../services/job.service';
import { ApplicationService, JobApplication } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  job: JobPosting | null = null;
  isLoading = true;
  errorMessage = '';
  userRole: string = '';
  userEmail: string = '';
  userId: string = '';

  // Application properties
  showApplicationForm = false;
  application: JobApplication = {
    jobId: '',
    applicantId: '',
    coverLetter: '',
    resume: '',
    status: 'pending',
    appliedDate: new Date().toISOString()
  };
  isSubmitting = false;
  applicationError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const userData = this.storageService.getUser();
    if (!userData) {
      this.router.navigate(['/auth/login']);
    } else {
      this.userRole = userData.role;
      this.userEmail = userData.email;
      this.userId = userData._id;
    }
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
        this.application.applicantId = this.userId;
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

    this.showApplicationForm = true;
  }

  submitApplication(): void {
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

  editJob(): void {
    if (!this.job) return;
    this.router.navigate(['/dashboard/post-job', this.job._id]);
  }

  deleteJob(): void {
    if (!this.job) return;

    if (confirm('Are you sure you want to delete this job posting?')) {
      this.jobService.deleteJob(this.job._id).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/job-list']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to delete job';
          console.error('Error deleting job:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  isJobOwner(): boolean {
    return this.userRole === 'employer' && this.job?.postedBy === this.userEmail;
  }

  cancelApplication(): void {
    this.showApplicationForm = false;
    this.application = {
      jobId: this.job?._id || '',
      applicantId: this.userId,
      coverLetter: '',
      resume: '',
      status: 'pending',
      appliedDate: new Date().toISOString()
    };
  }

  goBack(): void {
    this.router.navigate(['/dashboard/job-list']);
  }
} 