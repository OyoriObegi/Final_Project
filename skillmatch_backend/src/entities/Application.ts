import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Job } from './Job';

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  SHORTLISTED = 'shortlisted',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.applications)
  applicant: User;

  @ManyToOne(() => Job, job => job.applications)
  job: Job;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status: ApplicationStatus;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  matchScore?: number;

  @Column({ type: 'jsonb', nullable: true })
  aiAnalysis?: {
    skillMatch?: number;
    experienceMatch?: number;
    cultureFit?: number;
    recommendations?: string[];
    missingSkills?: string[];
  };

  @Column('text', { nullable: true })
  coverLetter?: string;

  @Column({ type: 'jsonb', nullable: true })
  interviews?: {
    scheduledDate: Date;
    type: string;
    status: string;
    feedback?: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  feedback?: {
    strengths?: string[];
    improvements?: string[];
    notes?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastStatusChangeAt?: Date;
} 