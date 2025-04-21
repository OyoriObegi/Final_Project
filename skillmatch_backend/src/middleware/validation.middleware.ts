import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './error.middleware';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: (err as any).param,
      message: (err as any).msg
    }));

    throw new ValidationError(JSON.stringify(errorMessages));
  };
};

// Common validation chains
export const userValidation = {
  register: [
    // Add your validation rules here
  ],
  login: [
    // Add your validation rules here
  ],
  updateProfile: [
    // Add your validation rules here
  ]
};

export const jobValidation = {
  create: [
    // Add your validation rules here
  ],
  update: [
    // Add your validation rules here
  ]
};

export const applicationValidation = {
  create: [
    // Add your validation rules here
  ],
  updateStatus: [
    // Add your validation rules here
  ]
};

export const skillValidation = {
  create: [
    // Add your validation rules here
  ],
  update: [
    // Add your validation rules here
  ]
};

export const portfolioValidation = {
  create: [
    // Add your validation rules here
  ],
  update: [
    // Add your validation rules here
  ]
};

export const cvValidation = {
  upload: [
    // Add your validation rules here
  ]
}; 