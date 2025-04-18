import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent {
  jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Tech Corp',
      location: 'Remote',
      tags: ['Angular', 'TypeScript', 'Remote']
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'Data Systems',
      location: 'New York',
      tags: ['Node.js', 'Python', 'AWS']
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Web Solutions',
      location: 'San Francisco',
      tags: ['React', 'Node.js', 'MongoDB']
    }
  ];
} 