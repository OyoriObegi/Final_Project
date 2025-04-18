import { Request, Response, NextFunction } from 'express';
import { AnySchema } from 'yup';

export const validateRequest = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error: any) {
    return res.status(400).json({
      status: 'error',
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: error.errors,
      },
    });
  }
}; 