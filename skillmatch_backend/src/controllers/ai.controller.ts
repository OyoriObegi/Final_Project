import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { ApiResponse } from '../types/api';

export const aiController = {
  async analyzeApplication(req: Request, res: Response) {
    try {
      const { cover_letter, job_description } = req.body;
      const result = await aiService.analyzeApplication(cover_letter, job_description);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in analyzeApplication controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async generateCoverLetter(req: Request, res: Response) {
    try {
      const { job_description, skills } = req.body;
      const result = await aiService.generateCoverLetter(job_description, skills);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in generateCoverLetter controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  async analyzeJobSkills(req: Request, res: Response) {
    try {
      const { job_description } = req.body;
      const result = await aiService.analyzeJobSkills(job_description);
      
      if (!result.success) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in analyzeJobSkills controller:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
}; 