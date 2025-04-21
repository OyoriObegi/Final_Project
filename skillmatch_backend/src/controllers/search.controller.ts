import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../entities/User';
import express from 'express';

const searchService = new SearchService();

export const searchRouter = express.Router();

// Search jobs
searchRouter.get(
  '/jobs',
  authenticate,
  validate({
    query: {
      keyword: { optional: true, isString: true },
      location: { optional: true, isString: true },
      type: { optional: true, isString: true },
      experienceLevel: { optional: true, isString: true }
    }
  }) as express.RequestHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await searchService.searchJobs(req.query);
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  }
);

// Search candidates
searchRouter.get(
  '/candidates',
  authenticate,
  checkRole([UserRole.RECRUITER]),
  validate({
    query: {
      skills: { optional: true, isArray: true },
      experience: { optional: true, isString: true },
      location: { optional: true, isString: true }
    }
  }) as express.RequestHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const candidates = await searchService.searchCandidates(req.query);
      res.json(candidates);
    } catch (error) {
      next(error);
    }
  }
);

export default searchRouter; 