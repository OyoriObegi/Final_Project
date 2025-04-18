import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent {
  jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'TechSavvy Inc.',
      location: 'Remote',
      tags: ['Angular', 'TypeScript', 'UI/UX'],
    },
    {
      id: 2,
      title: 'Data Analyst',
      company: 'Insights Corp.',
      location: 'Nairobi, Kenya',
      tags: ['Python', 'SQL', 'Tableau'],
    },
    {
      id: 3,
      title: 'Machine Learning Engineer',
      company: 'AIWorks',
      location: 'Hybrid - Nairobi',
      tags: ['ML', 'TensorFlow', 'Python'],
    }
  ];

}
