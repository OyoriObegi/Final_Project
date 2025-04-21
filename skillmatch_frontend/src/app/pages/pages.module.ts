import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { JobListComponent } from '../pages/job-list/job-list.component';
import { PagesRoutingModule } from './pages-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    JobListComponent,
    MatIconModule,
    NavbarComponent,
    FooterComponent,
    LandingComponent
  ]
})
export class PagesModule { }
