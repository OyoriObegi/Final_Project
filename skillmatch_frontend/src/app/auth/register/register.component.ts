import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface UserRole {
  value: 'jobseeker' | 'employer';
  label: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-container">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title">Register</h2>
          
          <!-- Error Message -->
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" 
                     class="form-control" 
                     id="email" 
                     formControlName="email"
                     [ngClass]="{'is-invalid': registerForm.get('email')?.invalid && registerForm.get('email')?.touched}">
              <div class="invalid-feedback" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" 
                     class="form-control" 
                     id="password" 
                     formControlName="password"
                     [ngClass]="{'is-invalid': registerForm.get('password')?.invalid && registerForm.get('password')?.touched}">
              <div class="invalid-feedback" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
                Password must be at least 6 characters long
              </div>
            </div>

            <div class="mb-3">
              <label for="role" class="form-label">Role</label>
              <select class="form-select" 
                      id="role" 
                      formControlName="role"
                      [ngClass]="{'is-invalid': registerForm.get('role')?.invalid && registerForm.get('role')?.touched}">
                <option *ngFor="let role of userRoles" [value]="role.value">{{role.label}}</option>
              </select>
              <div class="invalid-feedback" *ngIf="registerForm.get('role')?.invalid && registerForm.get('role')?.touched">
                Please select a role
              </div>
            </div>

            <button type="submit" 
                    class="btn btn-primary w-100" 
                    [disabled]="registerForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoading ? 'Registering...' : 'Register' }}
            </button>
          </form>

          <div class="mt-3 text-center">
            <p class="mb-0">
              Already have an account? 
              <a [routerLink]="['/auth/login']" class="text-primary">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      padding: 2rem;
    }

    .card {
      width: 100%;
      max-width: 400px;
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      .card-body {
        padding: 2rem;

        .card-title {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #212529;
        }

        .form-label {
          font-weight: 500;
          color: #212529;
        }

        .form-control, .form-select {
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 0.75rem;

          &:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          }
        }

        .btn-primary {
          padding: 0.75rem;
          font-weight: 500;
        }

        .text-primary {
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @media (max-width: 576px) {
      .register-container {
        padding: 1rem;
      }

      .card {
        .card-body {
          padding: 1.5rem;
        }
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  userRoles: UserRole[] = [
    { value: 'jobseeker', label: 'Job Seeker' },
    { value: 'employer', label: 'Employer' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['jobseeker', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, role } = this.registerForm.value;

    this.authService.register({ email, password, role }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
      }
    });
  }
}
