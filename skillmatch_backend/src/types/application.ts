export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected';

export interface Application {
  id: number;
  user_id: number;
  job_id: number;
  cover_letter: string;
  status: ApplicationStatus;
  created_at: Date;
  updated_at: Date;
}

export interface CreateApplicationRequest {
  job_id: number;
  cover_letter: string;
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus;
}

export interface ApplicationWithJob extends Application {
  job: {
    id: number;
    title: string;
    company_name: string;
    location: string;
    job_type: string;
    experience_level: string;
  };
}

export interface ApplicationWithUser extends Application {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    location?: string;
  };
} 