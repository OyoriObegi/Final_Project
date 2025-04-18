import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { RecommendedJobsComponent } from './recommended-jobs/recommended-jobs.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';
import { PostJobComponent } from './post-job/post-job.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardComponent } from './dashboard.component';
import { JobListComponent } from './job-list/job-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    DashboardComponent,
    RecommendedJobsComponent,
    MyApplicationsComponent,
    PostJobComponent,
    DashboardHomeComponent,
    JobListComponent
  ]
})
export class DashboardModule { }
