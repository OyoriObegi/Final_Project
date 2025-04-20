import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { Skill } from './Skill';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.portfolio)
  @JoinColumn()
  user: User;

  @Column('text', { nullable: true })
  summary?: string;

  @ManyToMany(() => Skill)
  @JoinTable({
    name: 'portfolio_skills',
    joinColumn: { name: 'portfolio_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' }
  })
  skills: Skill[];

  @Column({ type: 'jsonb' })
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    achievements?: string[];
    skills?: string[];
  }[];

  @Column({ type: 'jsonb' })
  education: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    gpa?: number;
    achievements?: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  projects: {
    name: string;
    description: string;
    url?: string;
    startDate?: Date;
    endDate?: Date;
    skills: string[];
    highlights?: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  certifications: {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    url?: string;
  }[];

  @Column({ type: 'text', array: true, nullable: true })
  languages?: string[];

  @Column({ type: 'jsonb', nullable: true })
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  achievements?: {
    title: string;
    date: Date;
    description: string;
    url?: string;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isPublic: boolean;
} 