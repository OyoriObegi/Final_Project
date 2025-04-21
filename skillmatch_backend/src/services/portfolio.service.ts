import { getRepository, In, Repository } from 'typeorm';
import { Portfolio } from '../entities/Portfolio';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import { BaseService } from './base.service';
import { NotFoundError, ValidationError } from '../middleware/error.middleware';
import AppDataSource from '../config/database';

interface CreatePortfolioDTO {
  userId: string;
  summary?: string;
  skillIds: string[];
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
  projects?: {
    name: string;
    description: string;
    url?: string;
    startDate?: Date;
    endDate?: Date;
    skills: string[];
    highlights?: string[];
  }[];
  certifications?: {
    name: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    url?: string;
  }[];
  languages?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
  };
  achievements?: {
    title: string;
    date: Date;
    description: string;
    url?: string;
  }[];
  isPublic?: boolean;
}

interface UpdatePortfolioDTO extends Partial<CreatePortfolioDTO> {}

interface Project {
  name: string;
  description: string;
  url?: string;
  startDate?: Date;
  endDate?: Date;
  skills: string[];
  highlights?: string[];
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

export class PortfolioService extends BaseService<Portfolio> {
  protected repository: Repository<Portfolio>;

  constructor() {
    super(getRepository(Portfolio));
    this.repository = AppDataSource.getRepository(Portfolio);
  }

  async createPortfolio(data: CreatePortfolioDTO): Promise<Portfolio> {
    const userRepository = getRepository(User);
    const skillRepository = getRepository(Skill);

    const user = await userRepository.findOne({
      where: { id: data.userId },
      relations: ['portfolio']
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.portfolio) {
      throw new ValidationError('User already has a portfolio');
    }

    const skills = await skillRepository.findBy({ id: In(data.skillIds) });

    const portfolio = await this.create({
      ...data,
      user,
      skills
    });

    return this.repository.save(portfolio);
  }

  async updatePortfolio(id: string, data: UpdatePortfolioDTO): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id } });
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    if (data.skillIds) {
      const skillRepository = getRepository(Skill);
      portfolio.skills = await skillRepository.findBy({ id: In(data.skillIds) });
    }

    return this.repository.save({
      ...portfolio,
      ...data
    });
  }

  async getPortfolioByUser(userId: string): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'skills']
    });

    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    return portfolio;
  }

  async analyzePortfolio(portfolioId: string): Promise<{
    topSkills: { skill: string; level: string }[];
    skillGaps: string[];
    recommendations: string[];
    careerInsights: {
      strengths: string[];
      improvements: string[];
      nextSteps: string[];
    };
  }> {
    const portfolio = await this.getPortfolioDetails(portfolioId);

    // TODO: Implement AI-based portfolio analysis
    return {
      topSkills: [],
      skillGaps: [],
      recommendations: [],
      careerInsights: {
        strengths: [],
        improvements: [],
        nextSteps: []
      }
    };
  }

  async getPortfolioDetails(portfolioId: string): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({
      where: { id: portfolioId },
      relations: ['user', 'skills']
    });

    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    return portfolio;
  }

  async addProject(portfolioId: string, project: Project): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id: portfolioId } });
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const projects = [...(portfolio.projects || []), project];
    return this.repository.save({
      ...portfolio,
      projects
    });
  }

  async addExperience(portfolioId: string, experience: CreatePortfolioDTO['experience'][0]): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id: portfolioId } });
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const experiences = [...(portfolio.experience || []), experience];
    return this.update(portfolioId, { experience: experiences });
  }

  async addEducation(portfolioId: string, education: CreatePortfolioDTO['education'][0]): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id: portfolioId } });
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const educations = [...(portfolio.education || []), education];
    return this.update(portfolioId, { education: educations });
  }

  async addCertification(portfolioId: string, certification: Certification): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id: portfolioId } });
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    const certifications = [...(portfolio.certifications || []), certification];
    return this.repository.save({
      ...portfolio,
      certifications
    });
  }

  async toggleVisibility(portfolioId: string): Promise<Portfolio> {
    const portfolio = await this.repository.findOne({ where: { id: portfolioId } });
    
    if (!portfolio) {
      throw new NotFoundError('Portfolio not found');
    }

    return this.update(portfolioId, { isPublic: !portfolio.isPublic });
  }

  async getPublicPortfolios(page: number = 1, limit: number = 10): Promise<{ portfolios: Portfolio[]; total: number }> {
    const [portfolios, total] = await this.repository.findAndCount({
      where: { isPublic: true },
      relations: ['user', 'skills'],
      skip: (page - 1) * limit,
      take: limit
    });

    return { portfolios, total };
  }
} 