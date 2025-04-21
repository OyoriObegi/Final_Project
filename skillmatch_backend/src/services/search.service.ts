import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import { Job } from '../entities/Job';
import { ExperienceLevel } from '../entities/Job';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>
  ) {}

  async searchCandidates(query: string): Promise<User[]> {
    // Parse the natural language query
    const parsedQuery = this.parseSearchQuery(query);
    
    // Build the query
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skills')
      .leftJoinAndSelect('user.experience', 'experience')
      .leftJoinAndSelect('user.education', 'education')
      .where('user.role = :role', { role: 'applicant' });

    // Apply skill filters
    if (parsedQuery.skills.length > 0) {
      queryBuilder.andWhere('skills.name IN (:...skills)', {
        skills: parsedQuery.skills
      });
    }

    // Apply experience level filter
    if (parsedQuery.experienceYears > 0) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements(user.experience) exp
          WHERE (
            EXTRACT(YEAR FROM CURRENT_DATE) - 
            EXTRACT(YEAR FROM (exp->>'startDate')::date)
          ) >= :years
        )`,
        { years: parsedQuery.experienceYears }
      );
    }

    // Apply role/position filter
    if (parsedQuery.role) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements(user.experience) exp
          WHERE exp->>'title' ILIKE :role
        )`,
        { role: `%${parsedQuery.role}%` }
      );
    }

    // Apply education filter
    if (parsedQuery.education) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1 FROM jsonb_array_elements(user.education) edu
          WHERE edu->>'degree' ILIKE :education
          OR edu->>'field' ILIKE :education
        )`,
        { education: `%${parsedQuery.education}%` }
      );
    }

    return queryBuilder.getMany();
  }

  private parseSearchQuery(query: string): {
    skills: string[];
    experienceYears: number;
    role?: string;
    education?: string;
  } {
    const result = {
      skills: [] as string[],
      experienceYears: 0,
      role: undefined as string | undefined,
      education: undefined as string | undefined
    };

    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();

    // Extract experience years
    const yearsMatch = lowerQuery.match(/(\d+)\+?\s*years?/);
    if (yearsMatch) {
      result.experienceYears = parseInt(yearsMatch[1], 10);
    }

    // Extract skills
    // Common tech skills regex patterns
    const skillPatterns = [
      /\b(react\.?js|angular|vue\.?js|node\.?js|python|java|typescript|javascript|aws|docker|kubernetes)\b/g,
      /\b(sql|nosql|mongodb|postgresql|mysql)\b/g,
      /\b(html5?|css3?|sass|less)\b/g,
      /\b(git|ci\/cd|jenkins|terraform)\b/g,
      /\b(machine learning|ai|deep learning|nlp)\b/g
    ];

    skillPatterns.forEach(pattern => {
      const matches = lowerQuery.match(pattern);
      if (matches) {
        result.skills.push(...matches);
      }
    });

    // Extract role/position
    const rolePatterns = [
      /\b(frontend|backend|full.?stack|dev.?ops|data scientist|software|developer)\b/,
      /\b(engineer|architect|lead|manager|director)\b/
    ];

    rolePatterns.forEach(pattern => {
      const match = lowerQuery.match(pattern);
      if (match) {
        result.role = match[0];
      }
    });

    // Extract education
    const educationPatterns = [
      /\b(bachelor'?s?|master'?s?|phd|doctorate|degree)\b/,
      /\b(computer science|engineering|information technology|it)\b/
    ];

    educationPatterns.forEach(pattern => {
      const match = lowerQuery.match(pattern);
      if (match) {
        result.education = match[0];
      }
    });

    return result;
  }

  async suggestRelatedSkills(skills: string[]): Promise<string[]> {
    // Find related skills based on job postings and user profiles
    const relatedSkills = await this.skillRepository
      .createQueryBuilder('skill')
      .where(qb => {
        const subQuery = qb
          .subQuery()
          .select('j.id')
          .from(Job, 'j')
          .leftJoin('j.requiredSkills', 'rs')
          .leftJoin('j.preferredSkills', 'ps')
          .where('rs.name IN (:...skills)')
          .orWhere('ps.name IN (:...skills)')
          .getQuery();
        return 'skill.id IN ' + subQuery;
      })
      .setParameter('skills', skills)
      .getMany();

    return relatedSkills.map(skill => skill.name);
  }

  async getPopularSkillCombinations(): Promise<Array<{
    skills: string[];
    count: number;
  }>> {
    // Find commonly co-occurring skills in job postings
    const results = await this.jobRepository
      .createQueryBuilder('job')
      .leftJoin('job.requiredSkills', 'skills')
      .select('array_agg(DISTINCT skills.name)', 'skills')
      .addSelect('COUNT(*)', 'count')
      .groupBy('job.id')
      .having('COUNT(*) > 1')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return results.map(result => ({
      skills: result.skills,
      count: parseInt(result.count, 10)
    }));
  }
} 