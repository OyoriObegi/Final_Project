import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PostJobComponent } from './post-job/post-job.component';
import { JobListComponent } from './job-list/job-list.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { AIInsightsComponent } from './ai-insights/ai-insights.component';
import { RecommendedJobsComponent } from './recommended-jobs/recommended-jobs.component';
import { MyApplicationsComponent } from './my-applications/my-applications.component';

const routes: Routes = [
  { 
    path: '', 
    component: DashboardComponent,
    children: [
      { path: '', component: JobListComponent },
      { path: 'post-job', component: PostJobComponent },
      { path: 'job-details/:id', component: JobDetailsComponent },
      { path: 'ai-insights', component: AIInsightsComponent },
      { path: 'recommended-jobs', component: RecommendedJobsComponent },
      { path: 'my-applications', component: MyApplicationsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
