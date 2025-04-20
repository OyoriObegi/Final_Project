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

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'skillmatch',
  entities: [User, Job, JobApplication, Skill, Application, Portfolio, CV],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts']
});

export default AppDataSource; 