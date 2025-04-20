import { Router } from 'express';
import { isAdmin } from '../middleware/auth.middleware';

const router = Router();

export default function initializeSkillRoutes() {
  const SkillController = require('../controllers/skill.controller').SkillController;
  const skillController = new SkillController();

  // Public routes (still requires authentication)
  router.get('/search', skillController.searchSkills);
  router.get('/popular', skillController.getPopularSkills);
  router.get('/:id', skillController.getById);
  router.get('/:id/stats', skillController.getSkillStats);
  router.get('/:id/related', skillController.suggestRelatedSkills);

  // Admin only routes
  router.post('/', isAdmin, skillController.createSkill);
  router.put('/:id/metadata', isAdmin, skillController.updateSkillMetadata);
  router.put('/:id/verify', isAdmin, skillController.verifySkill);
  router.put('/:id/assessment', isAdmin, skillController.updateAssessmentCriteria);
  router.post('/merge', isAdmin, skillController.mergeSkills);

  return router;
} 