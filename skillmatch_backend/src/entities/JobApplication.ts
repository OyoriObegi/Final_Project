import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Job } from './Job';
import { User } from './User';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  INTERVIEWING = 'interviewing'
}

@Entity('job_applications')
export class JobApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  jobId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Job, job => job.applications)
  @JoinColumn({ name: 'jobId' })
  job: Job;

  @ManyToOne(() => User, user => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter: string;

  @Column('jsonb', { nullable: true })
  resume: {
    url: string;
    filename: string;
    uploadedAt: Date;
  };

  @Column('jsonb', { nullable: true })
  answers: {
    questionId: string;
    question: string;
    answer: string;
  }[];

  @Column('jsonb', { nullable: true })
  metadata: {
    expectedSalary?: number;
    availableStartDate?: Date;
    noticePeriod?: string;
    currentCompany?: string;
    currentRole?: string;
    yearsOfExperience?: number;
    referredBy?: string;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @Column({ type: 'timestamp', nullable: true })
  archivedAt: Date;
} 