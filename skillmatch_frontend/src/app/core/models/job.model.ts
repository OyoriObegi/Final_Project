export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  TEMPORARY = 'TEMPORARY'
}

export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE'
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FILLED = 'FILLED'
}

export interface Job {
  id: string;
  title: string;
  description: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  salary: number;
  requirements: string[];
  preferredSkills?: string[];
  benefits?: string[];
  status: JobStatus;
  employerId: string;
  createdAt: Date;
  updatedAt: Date;
} 