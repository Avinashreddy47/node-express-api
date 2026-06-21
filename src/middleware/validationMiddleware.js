import Joi from 'joi';
import { errorResponse } from '../utils/response.js';

/**
 * Validation Middleware Factory
 * Creates middleware that validates request body/params/query against schema
 */
export const validateRequest = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.reduce((acc, detail) => {
        acc[detail.path.join('.')] = detail.message;
        return acc;
      }, {});

      return res.status(400).json(errorResponse('Validation failed', 400, errors));
    }

    req[source] = value;
    next();
  };
};

/**
 * Common validation schemas
 */
export const schemas = {
  userId: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  userCreate: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
  }),

  userUpdate: Joi.object({
    email: Joi.string().email(),
    username: Joi.string().alphanum().min(3).max(30),
    password: Joi.string().min(6),
  }).min(1),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }),
};
