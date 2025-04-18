import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponse } from '../types/apiResponse';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      const response: ApiResponse = {
        status: 'success',
        data: user,
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      const response: ApiResponse = {
        status: 'success',
        data: { token },
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  },

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const profile = await authService.getProfile(userId);
      const response: ApiResponse = {
        status: 'success',
        data: profile,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const updatedProfile = await authService.updateProfile(userId, req.body);
      const response: ApiResponse = {
        status: 'success',
        data: updatedProfile,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  },
}; 