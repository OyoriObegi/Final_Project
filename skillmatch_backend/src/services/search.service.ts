import { getRepository } from 'typeorm';
import { Job } from '../entities/Job';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import AppDataSource from '../config/database';

interface JobSearchParams {
  keyword?: string;
  location?: string;
  type?: string;
  experienceLevel?: string;
}

interface CandidateSearchParams {
  skills?: string[];
  experience?: string;
  location?: string;
}

export class SearchService {
  private jobRepository = AppDataSource.getRepository(Job);
  private userRepository = AppDataSource.getRepository(User);
  private skillRepository = AppDataSource.getRepository(Skill);

  async searchJobs(params: JobSearchParams) {
    const query = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.requiredSkills', 'requiredSkills')
      .leftJoinAndSelect('job.preferredSkills', 'preferredSkills')
      .where('job.isActive = :isActive', { isActive: true });

    if (params.keyword) {
      query.andWhere('(job.title ILIKE :keyword OR job.description ILIKE :keyword)', 
        { keyword: `%${params.keyword}%` });
    }

    if (params.location) {
      query.andWhere('job.location ILIKE :location', { location: `%${params.location}%` });
    }

    if (params.type) {
      query.andWhere('job.type = :type', { type: params.type });
    }

    if (params.experienceLevel) {
      query.andWhere('job.experienceLevel = :experienceLevel', { experienceLevel: params.experienceLevel });
    }

    return query.getMany();
  }

  async searchCandidates(params: CandidateSearchParams) {
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.skills', 'skills')
      .where('user.isActive = :isActive', { isActive: true });

    if (params.skills && params.skills.length > 0) {
      query.andWhere('skills.name IN (:...skills)', { skills: params.skills });
    }

    if (params.location) {
      query.andWhere('user.location ILIKE :location', { location: `%${params.location}%` });
    }

    if (params.experience) {
      query.andWhere('user.experience @> :experience', { 
        experience: JSON.stringify([{ level: params.experience }]) 
      });
    }

    return query.getMany();
  }

  async suggestRelatedSkills(skillNames: string[]) {
    const skills = await this.skillRepository.createQueryBuilder('skill')
      .where('skill.name IN (:...names)', { names: skillNames })
      .getMany();

    const relatedSkillIds = skills.flatMap(skill => 
      skill.metadata?.relatedSkills || []
    );

    if (relatedSkillIds.length === 0) return [];

    return this.skillRepository.createQueryBuilder('skill')
      .where('skill.id IN (:...ids)', { ids: relatedSkillIds })
      .getMany();
  }
} 