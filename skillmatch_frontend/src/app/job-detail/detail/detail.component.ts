import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ]
})
export class DetailComponent implements OnInit {
  job: any;
  showForm = false;
  applicant = {
    coverLetter: ''
  };
  jobId!: string;

  constructor(private route: ActivatedRoute, private jobService: JobService) {}

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';
    this.jobService.getJobById(this.jobId).subscribe((data) => {
      this.job = data;
    });
  }

  onApply(): void {
    this.jobService.applyToJob(this.jobId, this.applicant.coverLetter).subscribe({
      next: (res) => {
        alert('✅ Application submitted successfully!');
        this.applicant.coverLetter = '';
        this.showForm = false;
      },
      error: (err) => {
        console.error(err);
        alert('❌ Failed to apply. Please ensure you are logged in.');
      }
    });
  }
}
