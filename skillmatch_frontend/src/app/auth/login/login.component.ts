import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-container">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title">Login</h2>
          
          <!-- Error Message -->
          <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" 
                     class="form-control" 
                     id="email" 
                     formControlName="email"
                     [ngClass]="{'is-invalid': loginForm.get('email')?.invalid && loginForm.get('email')?.touched}">
              <div class="invalid-feedback" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Please enter a valid email address
              </div>
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" 
                     class="form-control" 
                     id="password" 
                     formControlName="password"
                     [ngClass]="{'is-invalid': loginForm.get('password')?.invalid && loginForm.get('password')?.touched}">
              <div class="invalid-feedback" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>

            <button type="submit" 
                    class="btn btn-primary w-100" 
                    [disabled]="loginForm.invalid || isLoading">
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>

          <div class="mt-3 text-center">
            <p class="mb-0">
              Don't have an account? 
              <a [routerLink]="['/auth/register']" class="text-primary">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
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

        .form-control {
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
      .login-container {
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
      }
    });
  }
}
