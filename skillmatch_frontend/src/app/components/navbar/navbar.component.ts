import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" routerLink="/">SkillMatch</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs">Jobs</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/profile">Profile</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" routerLink="/auth/login">Login</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .navbar-brand {
      font-weight: bold;
      color: #2c3e50;
    }
    .nav-link {
      color: #34495e;
      font-weight: 500;
    }
    .nav-link:hover {
      color: #3498db;
    }
  `]
})
export class NavbarComponent { } 