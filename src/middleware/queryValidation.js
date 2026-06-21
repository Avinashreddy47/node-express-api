/**
 * Query validation schemas
 * Validates query parameters for search, filter, sort, and pagination
 */
import Joi from 'joi';

export const querySchemas = {
  /**
   * Schema for list queries with advanced filtering
   */
  listQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
    search: Joi.string().max(100),
    searchFields: Joi.string(),

    // User-specific filters (can be extended for other resources)
    username_contains: Joi.string(),
    username_startsWith: Joi.string(),
    username_eq: Joi.string(),
    email_contains: Joi.string(),
    email_eq: Joi.string(),
    createdAt_gte: Joi.string().isoDate(),
    createdAt_lte: Joi.string().isoDate(),
    updatedAt_gte: Joi.string().isoDate(),
    updatedAt_lte: Joi.string().isoDate(),
  })
    .unknown(true) // Allow additional filter parameters
    .default({}),

  /**
   * Schema for search queries (simplified version for basic search)
   */
  searchQuery: Joi.object({
    q: Joi.string().required().max(100),
    fields: Joi.string().default('username,email'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
  }),
};
