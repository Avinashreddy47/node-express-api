import config from '../config/index.js';

/**
 * Structured Logger
 * Provides consistent logging format for production debugging
 */
export const logger = {
  info: (message, data = {}) => {
    console.log(
      JSON.stringify({
        level: 'INFO',
        timestamp: new Date().toISOString(),
        message,
        ...data,
        environment: config.environment,
      }),
    );
  },

  error: (message, error = {}, data = {}) => {
    console.error(
      JSON.stringify({
        level: 'ERROR',
        timestamp: new Date().toISOString(),
        message,
        error: {
          message: error.message,
          stack: config.isDevelopment ? error.stack : undefined,
        },
        ...data,
        environment: config.environment,
      }),
    );
  },

  warn: (message, data = {}) => {
    console.warn(
      JSON.stringify({
        level: 'WARN',
        timestamp: new Date().toISOString(),
        message,
        ...data,
        environment: config.environment,
      }),
    );
  },

  debug: (message, data = {}) => {
    if (config.isDevelopment) {
      console.log(
        JSON.stringify({
          level: 'DEBUG',
          timestamp: new Date().toISOString(),
          message,
          ...data,
          environment: config.environment,
        }),
      );
    }
  },
};
