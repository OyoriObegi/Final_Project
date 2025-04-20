import { getRepository, ILike, In } from 'typeorm';
import { Skill, SkillType } from '../entities/Skill';
import { BaseService } from './base.service';
import { ValidationError } from '../middleware/error.middleware';

interface SkillSearchParams {
  query?: string;
  type?: string;
  category?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
}

interface SkillStats {
  usersCount: number;
  jobsCount: number;
  averageSalary: number;
  marketDemand: number;
  relatedSkillsCount: number;
  lastUpdated: Date;
}

export class SkillService extends BaseService<Skill> {
  constructor() {
    super(getRepository(Skill));
  }

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    if (!data.name) {
      throw new ValidationError('Skill name is required');
    }

    // Generate slug from name
    data.slug = data.name.toLowerCase().replace(/\s+/g, '-');

    // Check for duplicate name or slug
    const existing = await this.repository.findOne({
      where: [
        { name: data.name },
        { slug: data.slug }
      ]
    });

    if (existing) {
      throw new ValidationError('Skill with this name already exists');
    }

    const skill = this.repository.create({
      ...data,
      isVerified: false,
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return this.repository.save(skill);
  }

  async searchSkills(params: SkillSearchParams): Promise<{ skills: Skill[]; total: number }> {
    const { query, type, category, isVerified, page = 1, limit = 10 } = params;
    
    const queryBuilder = this.repository.createQueryBuilder('skill');

    if (query) {
      queryBuilder.where(
        '(skill.name ILIKE :query OR skill.description ILIKE :query OR :query = ANY(skill.keywords))',
        { query: `%${query}%` }
      );
    }

    if (type) {
      queryBuilder.andWhere('skill.type = :type', { type });
    }

    if (category) {
      queryBuilder.andWhere("skill.metadata->>'category' = :category", { category });
    }

    if (isVerified !== undefined) {
      queryBuilder.andWhere('skill.isVerified = :isVerified', { isVerified });
    }

    const [skills, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { skills, total };
  }

  async getPopularSkills(limit: number = 10): Promise<Skill[]> {
    return this.repository.find({
      where: { isVerified: true },
      order: { usageCount: 'DESC' },
      take: limit
    });
  }

  async updateSkillMetadata(id: string, metadata: Partial<Skill['metadata']>): Promise<Skill> {
    const skill = await this.findById(id);
    if (!skill) {
      throw new ValidationError('Skill not found');
    }
    
    skill.metadata = {
      ...skill.metadata,
      ...metadata
    };
    skill.updatedAt = new Date();

    return this.repository.save(skill);
  }

  async verifySkill(id: string, adminId: string): Promise<Skill> {
    const skill = await this.findById(id);
    if (!skill) {
      throw new ValidationError('Skill not found');
    }
    
    skill.isVerified = true;
    skill.verifiedAt = new Date();
    skill.verifiedBy = adminId;
    skill.updatedAt = new Date();

    return this.repository.save(skill);
  }

  async mergeSkills(sourceId: string, targetId: string): Promise<Skill> {
    const source = await this.findById(sourceId);
    const target = await this.findById(targetId);

    if (!source || !target) {
      throw new ValidationError('Source or target skill not found');
    }

    // Merge metadata
    target.metadata = {
      ...target.metadata,
      aliases: [...(target.metadata?.aliases || []), source.name, ...(source.metadata?.aliases || [])],
      relatedSkills: [...new Set([
        ...(target.metadata?.relatedSkills || []),
        ...(source.metadata?.relatedSkills || [])
      ])]
    };

    // Merge keywords
    target.keywords = [...new Set([...target.keywords, ...source.keywords])];

    // Update usage count
    target.usageCount += source.usageCount;

    // Save target skill
    await this.repository.save(target);

    // Delete source skill
    await this.repository.remove(source);

    return target;
  }

  async getSkillStats(id: string): Promise<SkillStats> {
    const skill = await this.repository.findOne({
      where: { id },
      relations: ['users', 'requiredInJobs', 'preferredInJobs']
    });

    if (!skill) {
      throw new ValidationError('Skill not found');
    }

    return {
      usersCount: skill.users.length,
      jobsCount: skill.requiredInJobs.length + skill.preferredInJobs.length,
      averageSalary: skill.metadata?.averageSalary?.amount || 0,
      marketDemand: skill.metadata?.marketDemand || 0,
      relatedSkillsCount: skill.metadata?.relatedSkills?.length || 0,
      lastUpdated: skill.updatedAt
    };
  }

  async suggestRelatedSkills(id: string, limit: number = 5): Promise<Skill[]> {
    const skill = await this.findById(id);
    if (!skill) {
      throw new ValidationError('Skill not found');
    }
    
    if (!skill.metadata?.relatedSkills?.length) {
      return [];
    }

    return this.repository.find({
      where: {
        id: In(skill.metadata.relatedSkills),
        isVerified: true
      },
      take: limit
    });
  }

  async updateAssessmentCriteria(id: string, criteria: Skill['assessmentCriteria']): Promise<Skill> {
    const skill = await this.findById(id);
    if (!skill) {
      throw new ValidationError('Skill not found');
    }
    
    skill.assessmentCriteria = criteria;
    skill.updatedAt = new Date();

    return this.repository.save(skill);
  }
} 