import { Request, Response } from 'express';
import { BaseService } from '../services/base.service';
import { ObjectLiteral } from 'typeorm';
import { NotFoundError } from '../middleware/error.middleware';

export class BaseController<T extends ObjectLiteral> {
  constructor(protected service: BaseService<T>) {}

  protected sendResponse(res: Response, statusCode: number, success: boolean, message: string, data?: any) {
    res.status(statusCode).json({
      success,
      message,
      data
    });
  }

  protected sendError(res: Response, statusCode: number, message: string) {
    res.status(statusCode).json({
      success: false,
      message
    });
  }

  async getAll(req: Request, res: Response) {
    try {
      const items = await this.service.findAll();
      this.sendResponse(res, 200, true, 'Items retrieved successfully', items);
    } catch (error) {
      console.error('Error in getAll:', error);
      this.sendError(res, 500, 'Error retrieving items');
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await this.service.findById(id);
      if (!item) {
        return this.sendError(res, 404, 'Item not found');
      }
      this.sendResponse(res, 200, true, 'Item retrieved successfully', item);
    } catch (error) {
      console.error('Error in getById:', error);
      this.sendError(res, 500, 'Error retrieving item');
    }
  }

  async create(req: Request, res: Response) {
    try {
      const item = await this.service.create(req.body);
      this.sendResponse(res, 201, true, 'Item created successfully', item);
    } catch (error) {
      console.error('Error in create:', error);
      this.sendError(res, 500, 'Error creating item');
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await this.service.update(id, req.body);
      this.sendResponse(res, 200, true, 'Item updated successfully', item);
    } catch (error) {
      console.error('Error in update:', error);
      if (error instanceof NotFoundError) {
        return this.sendError(res, 404, 'Item not found');
      }
      this.sendError(res, 500, 'Error updating item');
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      this.sendResponse(res, 200, true, 'Item deleted successfully');
    } catch (error) {
      console.error('Error in delete:', error);
      this.sendError(res, 500, 'Error deleting item');
    }
  }
} 