import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from './error.middleware';

interface ValidationSchema {
  query?: {
    [key: string]: {
      optional?: boolean;
      isString?: boolean;
      isArray?: boolean;
      [key: string]: any;
    };
  };
  body?: {
    [key: string]: {
      optional?: boolean;
      isString?: boolean;
      isArray?: boolean;
      [key: string]: any;
    };
  };
}

export const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert schema to express-validator rules
      const rules = [];
      
      if (schema.query) {
        Object.entries(schema.query).forEach(([field, rules]) => {
          if (rules.optional) {
            rules.push((value: any) => value === undefined || value === '');
          }
          if (rules.isString) {
            rules.push((value: any) => typeof value === 'string');
          }
          if (rules.isArray) {
            rules.push((value: any) => Array.isArray(value));
          }
        });
      }

      if (schema.body) {
        Object.entries(schema.body).forEach(([field, rules]) => {
          if (rules.optional) {
            rules.push((value: any) => value === undefined || value === '');
          }
          if (rules.isString) {
            rules.push((value: any) => typeof value === 'string');
          }
          if (rules.isArray) {
            rules.push((value: any) => Array.isArray(value));
          }
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      next();
    } catch (error) {
      next(error);
    }
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