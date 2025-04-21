import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await getRepository(User).count();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router; 