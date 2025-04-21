import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Job } from '../entities/Job';
import { JobApplication } from '../entities/JobApplication';
import { Skill } from '../entities/Skill';
import { Application } from '../entities/Application';
import { Portfolio } from '../entities/Portfolio';
import { CV } from '../entities/CV';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'skillmatch',
  entities: [User, Job, JobApplication, Skill, Application, Portfolio, CV],

  // ✅ Turn off auto schema sync to avoid destructive changes
  synchronize: true,
  dropSchema: false,  // Use migrations instead of auto sync
  migrationsRun: true, // Automatically run migrations on startup

  // ✅ Logging only in development
  logging: !isProduction,

  // ✅ Use SSL in production (e.g., Render, Heroku, etc.)
  ssl: isProduction ? { rejectUnauthorized: false } : false,

  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts']
});

export default AppDataSource;
