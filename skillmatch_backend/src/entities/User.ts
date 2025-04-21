import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
  OneToOne
} from 'typeorm';
import { Job } from './Job';
import { JobApplication } from './JobApplication';
import { Skill } from './Skill';
import { Portfolio } from './Portfolio';
import bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  SEEKER = 'seeker',
  EMPLOYER = 'employer'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SEEKER
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING
  })
  status: UserStatus;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  profilePicture: string;

  // Job seeker specific fields
  @Column('jsonb', { nullable: true })
  resume: {
    url: string;
    filename: string;
    uploadedAt: Date;
  };

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'user_skills',
    joinColumn: { name: 'userId' },
    inverseJoinColumn: { name: 'skillId' }
  })
  skills: Skill[];

  @Column('jsonb', { nullable: true })
  experience: {
    company: string;
    title: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
  }[];

  @Column('jsonb', { nullable: true })
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }[];

  @OneToMany(() => JobApplication, application => application.user)
  applications: JobApplication[];

  // Employer specific fields
  @OneToMany(() => Job, job => job.employer)
  postedJobs: Job[];

  @Column('jsonb', { nullable: true })
  companyProfile: {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    founded?: number;
    description?: string;
    logo?: string;
    locations?: string[];
    socialLinks?: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
    };
  };

  // Common fields
  @Column('jsonb', { nullable: true })
  preferences: {
    jobTypes?: string[];
    locations?: string[];
    remoteOnly?: boolean;
    salaryExpectation?: {
      min: number;
      max: number;
      currency: string;
    };
    notifications?: {
      email: boolean;
      push: boolean;
      jobAlerts: boolean;
      applicationUpdates: boolean;
      messages: boolean;
    };
  };

  @Column({ type: 'text', array: true, default: '{}' })
  languages: string[];

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  phoneVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'int', default: 0 })
  loginCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt: Date;

  @Column({ type: 'text', nullable: true })
  suspensionReason: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne(() => Portfolio, portfolio => portfolio.user)
  portfolio: Portfolio;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
} 