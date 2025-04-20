import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Skill } from './Skill';
import { JobApplication } from './JobApplication';

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export enum JobStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived'
}
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  employerId: string;

  @ManyToOne(() => User, user => user.postedJobs)
  @JoinColumn({ name: 'employerId' })
  employer: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance']
  })
  type: JobType;

  @Column({
    type: 'enum',
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive']
  })
  experienceLevel: ExperienceLevel;

  @Column()
  location: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMin: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salaryMax: number;

  @Column({ type: 'text', nullable: true })
  salaryCurrency: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT
  })
  status: JobStatus;

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'job_required_skills',
    joinColumn: { name: 'jobId' },
    inverseJoinColumn: { name: 'skillId' }
  })
  requiredSkills: Skill[];

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'job_preferred_skills',
    joinColumn: { name: 'jobId' },
    inverseJoinColumn: { name: 'skillId' }
  })
  preferredSkills: Skill[];

  @OneToMany(() => JobApplication, application => application.job)
  applications: JobApplication[];

  @Column('jsonb', { nullable: true })
  metadata: {
    remote?: boolean;
    benefits?: string[];
    requirements?: string[];
    responsibilities?: string[];
    applicationQuestions?: {
      id: string;
      question: string;
      required: boolean;
      type: 'text' | 'multiline' | 'select' | 'multiselect';
      options?: string[];
    }[];
  };

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
} 