const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJob);

// Protected routes
router.post('/', authMiddleware, roleMiddleware(['employer', 'admin']), jobController.createJob);
router.put('/:id', authMiddleware, roleMiddleware(['employer', 'admin']), jobController.updateJob);
router.delete('/:id', authMiddleware, roleMiddleware(['employer', 'admin']), jobController.deleteJob);
router.get('/recommended', authMiddleware, jobController.getRecommendedJobs);

module.exports = router; 