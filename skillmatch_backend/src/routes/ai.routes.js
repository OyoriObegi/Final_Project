const express = require('express');
const router = express.Router();
const aiService = require('../services/ai.service');
const { authMiddleware } = require('../middleware/auth.middleware');

// Protected routes
router.post('/analyze-resume', authMiddleware, async (req, res) => {
  try {
    const { resumeText } = req.body;
    const analysis = await aiService.analyzeResume(resumeText);
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error analyzing resume',
      error: error.message
    });
  }
});

router.get('/career-path', authMiddleware, async (req, res) => {
  try {
    const careerPath = await aiService.generateCareerPath(req.user.id);
    res.json({
      success: true,
      data: careerPath
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating career path',
      error: error.message
    });
  }
});

module.exports = router; 