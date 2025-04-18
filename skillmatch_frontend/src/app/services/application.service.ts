import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type ApplicationStatus = 'pending' | 'reviewed' | 'accepted' | 'rejected';

export interface JobApplication {
  _id?: string;
  jobId: string;
  applicantId: string;
  coverLetter: string;
  resume: string;
  status: ApplicationStatus;
  appliedDate: string;
  jobTitle?: string;
  company?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient) {}

  applyForJob(application: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, application);
  }

  getUserApplications(userId: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/user/${userId}`);
  }

  getJobApplications(jobId: string): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(`${this.apiUrl}/job/${jobId}`);
  }

  updateApplicationStatus(applicationId: string, status: ApplicationStatus): Observable<JobApplication> {
    return this.http.patch<JobApplication>(`${this.apiUrl}/${applicationId}/status`, { status });
  }

  getApplicationById(applicationId: string): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${applicationId}`);
  }
} 