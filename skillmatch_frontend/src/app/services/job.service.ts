import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JobPosting {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  location: string;
  experienceLevel: string;
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
  postedBy: string;
}

export interface JobResponse {
  jobs: JobPosting[];
  totalPages: number;
  currentPage: number;
  totalJobs: number;
}

export interface JobFilters {
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  location?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) {}

  getJobs(filters: JobFilters = {}): Observable<JobResponse> {
    const params = this.buildQueryParams(filters);
    return this.http.get<JobResponse>(`${this.apiUrl}`, { params });
  }

  getJobById(id: string): Observable<JobPosting> {
    return this.http.get<JobPosting>(`${this.apiUrl}/${id}`);
  }

  createJob(job: Omit<JobPosting, '_id' | 'createdAt' | 'updatedAt'>): Observable<JobPosting> {
    return this.http.post<JobPosting>(this.apiUrl, job);
  }

  updateJob(id: string, job: Partial<JobPosting>): Observable<JobPosting> {
    return this.http.patch<JobPosting>(`${this.apiUrl}/${id}`, job);
  }

  deleteJob(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRecommendedJobs(userId: string): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.apiUrl}/jobs/recommended/${userId}`);
  }

  private buildQueryParams(filters: JobFilters): { [key: string]: string } {
    const params: { [key: string]: string } = {};
    
    if (filters.search) params['search'] = filters.search;
    if (filters.jobType) params['jobType'] = filters.jobType;
    if (filters.experienceLevel) params['experienceLevel'] = filters.experienceLevel;
    if (filters.location) params['location'] = filters.location;
    if (filters.page) params['page'] = filters.page.toString();
    if (filters.limit) params['limit'] = filters.limit.toString();
    
    return params;
  }
} 