import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('cvs')
export class CV {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  path: string;

  @Column('bigint')
  size: number;

  @Column({ type: 'jsonb', nullable: true })
  parsedData?: {
    personalInfo?: {
      name?: string;
      email?: string;
      phone?: string;
      location?: string;
    };
    experience?: {
      company: string;
      position: string;
      duration: string;
      description: string[];
    }[];
    education?: {
      institution: string;
      degree: string;
      year: string;
    }[];
    skills?: string[];
    languages?: string[];
    certifications?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  aiAnalysis?: {
    extractedSkills: string[];
    suggestedSkills: string[];
    careerLevel: string;
    domainExpertise: string[];
    strengthAreas: string[];
    improvementAreas: string[];
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
} 