import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validateRequest } from '../middleware/validateRequest';
import { analyzeApplicationSchema, generateCoverLetterSchema, analyzeJobSkillsSchema } from '../validators/ai.validator';

const router = Router();

/**
 * @swagger
 * /api/ai/analyze-application:
 *   post:
 *     summary: Analyze a job application
 *     description: Analyzes a cover letter against a job description and provides feedback
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cover_letter
 *               - job_description
 *             properties:
 *               cover_letter:
 *                 type: string
 *                 description: The applicant's cover letter
 *               job_description:
 *                 type: string
 *                 description: The job description to analyze against
 *     responses:
 *       200:
 *         description: Analysis completed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/analyze-application',
  authenticate,
  authorize(['job_seeker']),
  validateRequest(analyzeApplicationSchema),
  aiController.analyzeApplication
);

/**
 * @swagger
 * /api/ai/generate-cover-letter:
 *   post:
 *     summary: Generate a cover letter
 *     description: Generates a personalized cover letter based on job description and skills
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_description
 *               - skills
 *             properties:
 *               job_description:
 *                 type: string
 *                 description: The job description to target
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of skills to highlight
 *     responses:
 *       200:
 *         description: Cover letter generated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/generate-cover-letter',
  authenticate,
  authorize(['job_seeker']),
  validateRequest(generateCoverLetterSchema),
  aiController.generateCoverLetter
);

/**
 * @swagger
 * /api/ai/analyze-job-skills:
 *   post:
 *     summary: Analyze job skills
 *     description: Analyzes a job description to identify required skills and qualifications
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - job_description
 *             properties:
 *               job_description:
 *                 type: string
 *                 description: The job description to analyze
 *     responses:
 *       200:
 *         description: Analysis completed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/analyze-job-skills',
  authenticate,
  authorize(['employer']),
  validateRequest(analyzeJobSkillsSchema),
  aiController.analyzeJobSkills
);

export default router; 