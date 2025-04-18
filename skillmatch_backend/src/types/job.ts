export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead';
export type JobStatus = 'active' | 'closed' | 'draft';

export interface Job {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_range?: string;
  requirements?: string;
  benefits?: string;
  status: JobStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  company_name: string;
  location: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_range?: string;
  requirements?: string;
  benefits?: string;
  status?: JobStatus;
  required_skills?: number[];
  optional_skills?: number[];
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  company_name?: string;
  location?: string;
  job_type?: JobType;
  experience_level?: ExperienceLevel;
  salary_range?: string;
  requirements?: string;
  benefits?: string;
  status?: JobStatus;
  required_skills?: number[];
  optional_skills?: number[];
}

export interface JobSearchParams {
  title?: string;
  location?: string;
  job_type?: JobType;
  experience_level?: ExperienceLevel;
  company_name?: string;
  page?: number;
  limit?: number;
}

export interface JobWithSkills extends Job {
  required_skills: {
    id: number;
    name: string;
    category: string;
  }[];
  optional_skills: {
    id: number;
    name: string;
    category: string;
  }[];
} 