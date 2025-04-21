import { Router } from 'express';
import { query, validationResult } from 'express-validator';
import { SearchService } from '../services/search.service';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../entities/User';

const router = Router();
const searchService = new SearchService();

// Search jobs
router.get('/jobs', 
  authenticate,
  [
    query('keyword').optional().isString().trim(),
    query('location').optional().isString().trim(),
    query('type').optional().isString().trim(),
    query('experienceLevel').optional().isString().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { keyword, location, type, experienceLevel } = req.query;
      const jobs = await searchService.searchJobs({
        keyword: keyword as string,
        location: location as string,
        type: type as string,
        experienceLevel: experienceLevel as string
      });
      res.json(jobs);
    } catch (error) {
      next(error);
    }
});

// Search candidates
router.get('/candidates', 
  authenticate, 
  checkRole([UserRole.RECRUITER]),
  [
    query('skills').optional().isArray(),
    query('experience').optional().isString().trim(),
    query('location').optional().isString().trim()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { skills, experience, location } = req.query;
      const candidates = await searchService.searchCandidates({
        skills: skills as string[],
        experience: experience as string,
        location: location as string
      });
      res.json(candidates);
    } catch (error) {
      next(error);
    }
});

export default router; 