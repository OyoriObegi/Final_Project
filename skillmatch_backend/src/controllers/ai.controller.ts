import { Router } from 'express';
import { GeminiService } from '../services/gemini.service';
import { authenticate } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { UserRole } from '../entities/User';

const router = Router();
const geminiService = new GeminiService();

// Analyze CV
router.post('/analyze-cv', authenticate, async (req, res, next) => {
  try {
    const { cvText } = req.body;
    const analysis = await geminiService.analyzeCVContent(cvText);
    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

// Generate job description
router.post('/generate-job-description', authenticate, async (req, res, next) => {
  try {
    const { title, requirements, company } = req.body;
    const description = await geminiService.generateJobDescription({
      title,
      requirements,
      company
    });
    res.json({ description });
  } catch (error) {
    next(error);
  }
});

// Match candidate to job
router.post('/match-candidate', authenticate, async (req, res, next) => {
  try {
    const { cvContent, jobDescription } = req.body;
    const match = await geminiService.matchCandidateToJob(cvContent, jobDescription);
    res.json(match);
  } catch (error) {
    next(error);
  }
});

export default router; 