import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from 'typeorm';
import { User } from './User';
import { Job } from './Job';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type SkillType = 'technical' | 'soft' | 'language' | 'certification' | 'tool';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['technical', 'soft', 'language', 'certification', 'tool'],
    default: 'technical'
  })
  type: SkillType;

  @Column('jsonb', { nullable: true })
  metadata: {
    aliases?: string[];
    category?: string;
    subcategory?: string;
    versions?: string[];
    relatedSkills?: string[];
    prerequisites?: string[];
    certifications?: string[];
    popularity?: number;
    marketDemand?: number;
    averageSalary?: {
      amount: number;
      currency: string;
    };
  };

  @ManyToMany(() => User, user => user.skills)
  users: User[];

  @ManyToMany(() => Job, job => job.requiredSkills)
  requiredInJobs: Job[];

  @ManyToMany(() => Job, job => job.preferredSkills)
  preferredInJobs: Job[];

  @Column('jsonb', { nullable: true })
  assessmentCriteria: {
    level: SkillLevel;
    criteria: string[];
    yearsOfExperience?: number;
  }[];

  @Column({ type: 'text', array: true, default: '{}' })
  keywords: string[];

  @Column({ type: 'boolean', default: true })
  isVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUsed: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string;
} 