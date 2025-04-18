import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService, JobPosting } from '../../services/job.service';
import { StorageService } from '../../services/storage.service';

interface JobType {
  value: string;
  label: string;
}

interface ExperienceLevel {
  value: string;
  label: string;
}

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.scss']
})
export class PostJobComponent implements OnInit {
  jobForm: FormGroup;
  skills: string[] = [];
  currentSkill: string = '';
  isLoading = false;
  errorMessage = '';

  jobTypes: JobType[] = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
    { value: 'remote', label: 'Remote' }
  ];

  experienceLevels: ExperienceLevel[] = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'lead', label: 'Lead' },
    { value: 'executive', label: 'Executive' }
  ];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private jobService: JobService,
    private storageService: StorageService
  ) {
    this.jobForm = this.fb.group({
      jobTitle: ['', [Validators.required, Validators.minLength(5)]],
      jobDescription: ['', [Validators.required, Validators.minLength(50)]],
      jobType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      location: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      currentSkill: [''],
      keyResponsibilities: ['', Validators.required],
      qualifications: ['', Validators.required],
      benefits: ['', Validators.required],
      applicationDeadline: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const userData = this.storageService.getItem('user');
    if (!userData || (typeof userData === 'string' && JSON.parse(userData).role !== 'employer')) {
      this.router.navigate(['/auth/login']);
    }
  }

  addSkill(): void {
    if (this.currentSkill.trim() && !this.skills.includes(this.currentSkill.trim())) {
      this.skills.push(this.currentSkill.trim());
      this.currentSkill = '';
    }
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
  }

  onSubmit(): void {
    if (this.jobForm.valid && this.skills.length > 0) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData = this.storageService.getItem('user');
      const user = typeof userData === 'string' ? JSON.parse(userData) : {};
      const jobData: JobPosting = {
        ...this.jobForm.value,
        requiredSkills: this.skills,
        postedBy: user.email,
        postedDate: new Date().toISOString()
      };

      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to post job. Please try again.';
          console.error('Error posting job:', error);
        }
      });
    } else {
      Object.keys(this.jobForm.controls).forEach(key => {
        this.jobForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
