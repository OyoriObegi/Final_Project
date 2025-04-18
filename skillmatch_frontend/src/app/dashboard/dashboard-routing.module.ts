import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PostJobComponent } from './post-job/post-job.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailsComponent } from './job-details/job-details.component';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    children: [
      { path: '', component: JobListComponent },
      { path: 'post-job', component: PostJobComponent },
      { path: 'job-details/:id', component: JobDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
