import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent {
  showForm = false;
  applicant = {
    name: '',
    email: '',
    coverLetter: ''
  };

  jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechSavvy Inc.',
      location: 'Remote',
      tags: ['Angular', 'TypeScript', 'UI/UX'],
      jobDescription: 'We are looking for a frontend developer with solid Angular experience...'
    }
    // Add more jobs here
  ];

  get job() {
    return this.jobs[0];
  }

  onApply(): void {
    console.log('Application submitted:', this.applicant);
    this.applicant = { name: '', email: '', coverLetter: '' };
    this.showForm = false;
  }
}
