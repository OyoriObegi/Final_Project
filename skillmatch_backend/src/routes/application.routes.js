const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['job_seeker']), applicationController.createApplication);
router.get('/', authMiddleware, applicationController.getApplications);
router.get('/:id', authMiddleware, applicationController.getApplication);
router.put('/:id/status', authMiddleware, roleMiddleware(['employer', 'admin']), applicationController.updateApplicationStatus);

module.exports = router; 