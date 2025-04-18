import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userRole: string = '';
  userName: string = '';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    const userData = this.storageService.getUser();
    if (userData) {
      const user = JSON.parse(userData);
      this.userRole = user.role;
      this.userName = user.role === 'jobseeker' 
        ? `${user.firstName} ${user.lastName}`
        : user.companyName;
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  getDashboardTitle(): string {
    switch(this.userRole) {
      case 'jobseeker':
        return 'Job Seeker Dashboard';
      case 'employer':
        return 'Employer Dashboard';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  }

  logout() {
    this.storageService.removeUser();
    this.router.navigate(['/auth/login']);
  }
} 