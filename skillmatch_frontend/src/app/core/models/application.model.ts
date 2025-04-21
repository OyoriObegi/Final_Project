export enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface Interview {
  id: string;
  date: Date;
  type: string;
  notes?: string;
  location?: string;
  link?: string;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resume?: string;
  feedback?: string;
  interviews?: Interview[];
  createdAt: Date;
  updatedAt: Date;
} 