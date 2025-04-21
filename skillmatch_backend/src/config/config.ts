import { cleanEnv, str, port, email } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

const config = cleanEnv(process.env, {
  JWT_SECRET: str(),
  PORT: port({ default: 3000 }),
  HOST: str({ default: 'localhost' }),
  CORS_ORIGIN: str({ default: 'http://localhost:4200' }),
  GEMINI_API_KEY: str(),
  EMAIL_SERVICE_HOST: str(),
  EMAIL_SERVICE_PORT: port(),
  EMAIL_SERVICE_USER: str(),
  EMAIL_SERVICE_PASS: str(),
});

export default {
  jwtSecret: config.JWT_SECRET,
  port: config.PORT,
  host: config.HOST,
  corsOrigin: config.CORS_ORIGIN,
  geminiApiKey: config.GEMINI_API_KEY,
  emailService: {
    host: config.EMAIL_SERVICE_HOST,
    port: config.EMAIL_SERVICE_PORT,
    user: config.EMAIL_SERVICE_USER,
    pass: config.EMAIL_SERVICE_PASS,
  },
}; 