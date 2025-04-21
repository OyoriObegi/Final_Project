import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { SkillService } from '../services/skill.service';
import { Skill } from '../entities/Skill';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SkillController extends BaseController<Skill> {
  constructor(private skillService: SkillService = new SkillService()) {
    super(skillService);
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const skills = await this.service.findAll();
      res.status(200).json(skills);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch skills', error });
    }
  }

  createSkill = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skill = await this.skillService.createSkill(req.body);
      this.sendResponse(res, 201, true, 'Skill created successfully', skill);
    } catch (error) {
      next(error);
    }
  };

  searchSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { query, type, category, isVerified, page, limit } = req.query;
      const skills = await this.skillService.searchSkills({
        query: query as string,
        type: type as string,
        category: category as string,
        isVerified: isVerified === 'true',
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      });
      this.sendResponse(res, 200, true, 'Skills retrieved successfully', skills);
    } catch (error) {
      next(error);
    }
  };

  getPopularSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { limit } = req.query;
      const skills = await this.skillService.getPopularSkills(Number(limit) || 10);
      this.sendResponse(res, 200, true, 'Popular skills retrieved successfully', skills);
    } catch (error) {
      next(error);
    }
  };

  updateSkillMetadata = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const skill = await this.skillService.updateSkillMetadata(id, req.body);
      this.sendResponse(res, 200, true, 'Skill metadata updated successfully', skill);
    } catch (error) {
      next(error);
    }
  };

  verifySkill = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      if (!adminId) {
        return this.sendError(res, 401, 'Unauthorized');
      }

      const skill = await this.skillService.verifySkill(id, adminId);
      this.sendResponse(res, 200, true, 'Skill verified successfully', skill);
    } catch (error) {
      next(error);
    }
  };

  mergeSkills = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { sourceId, targetId } = req.body;
      const adminId = req.user?.id;

      if (!adminId) {
        return this.sendError(res, 401, 'Unauthorized');
      }

      const result = await this.skillService.mergeSkills(sourceId, targetId);
      this.sendResponse(res, 200, true, 'Skills merged successfully', result);
    } catch (error) {
      next(error);
    }
  };

  getSkillStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const stats = await this.skillService.getSkillStats(id);
      this.sendResponse(res, 200, true, 'Skill stats retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  };

  suggestRelatedSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { limit } = req.query;
      const skills = await this.skillService.suggestRelatedSkills(id, Number(limit) || 5);
      this.sendResponse(res, 200, true, 'Related skills suggested successfully', skills);
    } catch (error) {
      next(error);
    }
  };

  updateAssessmentCriteria = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const adminId = req.user?.id;

      if (!adminId) {
        return this.sendError(res, 401, 'Unauthorized');
      }

      const skill = await this.skillService.updateAssessmentCriteria(id, req.body);
      this.sendResponse(res, 200, true, 'Assessment criteria updated successfully', skill);
    } catch (error) {
      next(error);
    }
  };
}
