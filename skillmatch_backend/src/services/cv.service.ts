import { Repository } from 'typeorm';
import { CV } from '../entities/CV';
import { User } from '../entities/User';
import { NotFoundError } from '../middleware/error.middleware';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { CreateCVDTO, UpdateCVDTO } from '../dtos/cv.dto';
import AppDataSource from '../config/database';

const unlinkAsync = promisify(fs.unlink);

interface UploadCVDTO {
  userId: string;
  file: Express.Multer.File;
}

interface ParsedCV {
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
}

export class CVService {
  protected repository: Repository<CV>;

  constructor() {
    this.repository = AppDataSource.getRepository(CV);
  }

  async uploadCV(data: UploadCVDTO): Promise<CV> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: data.userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Parse CV content
    const parsedData = await this.parseCV(data.file);

    const cv = new CV();
    Object.assign(cv, {
      user,
      filename: data.file.filename,
      originalName: data.file.originalname,
      mimeType: data.file.mimetype,
      path: data.file.path,
      size: data.file.size,
      parsedData,
      isActive: true
    });

    // Perform AI analysis
    cv.aiAnalysis = await this.analyzeCV(cv);

    return this.repository.save(cv);
  }

  async deleteCV(cvId: string): Promise<void> {
    const cv = await this.repository.findOne({ where: { id: cvId } });

    if (cv) {
      // Delete physical file
      try {
        await unlinkAsync(cv.path);
      } catch (error) {
        console.error('Error deleting CV file:', error);
      }

      await this.repository.remove(cv);
    }
  }

  async getCVsByUser(userId: string): Promise<CV[]> {
    return this.repository.find({
      where: { user: { id: userId }, isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async getCVDetails(cvId: string): Promise<CV> {
    const cv = await this.repository.findOne({
      where: { id: cvId },
      relations: ['user']
    });

    if (!cv) {
      throw new NotFoundError('CV not found');
    }

    return cv;
  }

  private async parseCV(file: Express.Multer.File): Promise<ParsedCV> {
    // TODO: Implement CV parsing logic
    // This should:
    // 1. Extract text from PDF/DOC/DOCX
    // 2. Use NLP to identify sections
    // 3. Extract structured data
    // 4. Validate and clean data
    return {};
  }

  private async analyzeCV(cv: CV): Promise<{
    extractedSkills: string[];
    suggestedSkills: string[];
    careerLevel: string;
    domainExpertise: string[];
    strengthAreas: string[];
    improvementAreas: string[];
  }> {
    // TODO: Implement AI-based CV analysis
    // This should:
    // 1. Analyze skills and experience
    // 2. Determine career level
    // 3. Identify domain expertise
    // 4. Suggest improvements
    return {
      extractedSkills: [],
      suggestedSkills: [],
      careerLevel: '',
      domainExpertise: [],
      strengthAreas: [],
      improvementAreas: []
    };
  }

  async updateCV(id: string, data: UpdateCVDTO): Promise<CV> {
    const cv = await this.repository.findOne({ where: { id } });
    
    if (!cv) {
      throw new NotFoundError('CV not found');
    }

    Object.assign(cv, data);
    cv.aiAnalysis = await this.analyzeCV(cv);
    
    return this.repository.save(cv);
  }

  async getRecommendedJobs(cvId: string): Promise<any[]> {
    // TODO: Implement job recommendations based on CV
    return [];
  }

  async getSkillSuggestions(cvId: string): Promise<string[]> {
    // TODO: Implement skill suggestions based on CV content and career path
    return [];
  }
} 