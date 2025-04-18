const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Public routes
router.get('/', skillController.getSkills);
router.get('/popular', skillController.getPopularSkills);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['admin']), skillController.createSkill);
router.put('/user', authMiddleware, skillController.updateUserSkills);

module.exports = router; 