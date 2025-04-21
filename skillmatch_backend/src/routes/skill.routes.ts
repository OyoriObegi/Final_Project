import { Router } from 'express';
import { SkillController } from '../controllers/skill.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const skillController = new SkillController();

router.get('/', authenticate, skillController.getAll);
router.post('/', authenticate, skillController.create);
router.put('/:id', authenticate, skillController.update);
router.delete('/:id', authenticate, skillController.delete);

export default router;
