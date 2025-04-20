import dotenv from 'dotenv';
import { cleanEnv, str, port, bool, num } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  // Server
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 3000 }),
  API_PREFIX: str({ default: '/api' }),
  
  // Database
  DB_HOST: str({ default: 'localhost' }),
  DB_PORT: port({ default: 5432 }),
  DB_USERNAME: str({ default: 'postgres' }),
  DB_PASSWORD: str(),
  DB_NAME: str({ default: 'skillmatch' }),
  
  // Authentication
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '7d' }),
  REFRESH_TOKEN_SECRET: str({ default: undefined }),
  REFRESH_TOKEN_EXPIRES_IN: str({ default: '30d' }),
  
  // Email
  SMTP_HOST: str({ default: undefined }),
  SMTP_PORT: port({ default: 587 }),
  SMTP_USER: str({ default: undefined }),
  SMTP_PASS: str({ default: undefined }),
  EMAIL_FROM: str({ default: 'noreply@skillmatch.com' }),
  
  // File Upload
  UPLOAD_DIR: str({ default: 'uploads' }),
  MAX_FILE_SIZE: num({ default: 5242880 }), // 5MB
  ALLOWED_FILE_TYPES: str({ default: '.pdf,.doc,.docx' }),
  
  // AWS S3 (optional)
  AWS_ACCESS_KEY_ID: str({ default: undefined }),
  AWS_SECRET_ACCESS_KEY: str({ default: undefined }),
  AWS_REGION: str({ default: undefined }),
  AWS_BUCKET_NAME: str({ default: undefined }),
  
  // Redis (optional)
  REDIS_URL: str({ default: undefined }),
  USE_REDIS_CACHE: bool({ default: false }),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: num({ default: 900000 }), // 15 minutes
  RATE_LIMIT_MAX: num({ default: 100 }), // 100 requests per window
  
  // Security
  CORS_ORIGIN: str({ default: '*' }),
  ENABLE_HTTPS: bool({ default: false }),
  SSL_KEY_PATH: str({ default: undefined }),
  SSL_CERT_PATH: str({ default: undefined })
}); 