import dotenv from 'dotenv';

dotenv.config();

const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  api: {
    version: process.env.API_VERSION || 'v1',
    logLevel: process.env.LOG_LEVEL || 'info'
  },
  
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production'
};

export default config;
