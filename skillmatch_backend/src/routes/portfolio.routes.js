const express = require('express');
const router = express.Router();
const multer = require('multer');
const portfolioController = require('../controllers/portfolio.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Protected routes
router.post('/', authMiddleware, upload.array('images', 5), portfolioController.createPortfolio);
router.put('/:id', authMiddleware, upload.array('images', 5), portfolioController.updatePortfolio);
router.get('/', authMiddleware, portfolioController.getPortfolios);
router.get('/:id', authMiddleware, portfolioController.getPortfolio);
router.delete('/:id', authMiddleware, portfolioController.deletePortfolio);

module.exports = router; 