import { Routes } from '@angular/router';
import { JobListComponent } from '../pages/job-list/job-list.component';

export const jobsRoutes: Routes = [
  {
    path: '',
    component: JobListComponent
  }
];