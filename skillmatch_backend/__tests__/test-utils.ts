import { DataSource } from 'typeorm';
import { User } from '../src/entities/User';
import { Job } from '../src/entities/Job';
import { Skill } from '../src/entities/Skill';
import { JobApplication } from '../src/entities/JobApplication';
import { Application } from '../src/entities/Application';
import { Portfolio } from '../src/entities/Portfolio';

// Database configuration from environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '5432');
const DB_USERNAME = process.env.DB_USERNAME || 'postgres';  // Default PostgreSQL superuser
const DB_PASSWORD = process.env.DB_PASSWORD || 'your_password';
const DB_TEST_DATABASE = process.env.DB_TEST_DATABASE || 'skillmatch_test';

export const testDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_TEST_DATABASE,
  synchronize: true,
  dropSchema: true,
  entities: [User, Job, Skill, JobApplication, Application, Portfolio],
  logging: false
});

const setupTestDatabase = async () => {
  // First connect to 'postgres' database to ensure our test database exists
  const setupConnection = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'postgres',  // Connect to default postgres database first
    synchronize: false
  });

  try {
    await setupConnection.initialize();
    
    // Create the test database if it doesn't exist
    await setupConnection.query(`
      SELECT 'CREATE DATABASE ${DB_TEST_DATABASE}'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_TEST_DATABASE}')
    `);
    
    // Create the uuid-ossp extension in the test database
    await setupConnection.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    `);
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  } finally {
    if (setupConnection.isInitialized) {
      await setupConnection.destroy();
    }
  }
};

export const initializeTestDataSource = async () => {
  try {
    if (testDataSource.isInitialized) {
      await testDataSource.destroy();
    }

    // Ensure test database and extensions are set up
    await setupTestDatabase();
    
    // Initialize the test data source
    await testDataSource.initialize();
    
    // Enable UUID extension in the test database
    const queryRunner = testDataSource.createQueryRunner();
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;');
    await queryRunner.release();
    
    return testDataSource;
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
};

export const clearTestDatabase = async () => {
  try {
    // Drop all tables in the correct order to handle foreign key constraints
    const queryRunner = testDataSource.createQueryRunner();
    
    // Drop the schema and recreate it to remove all tables and types
    await queryRunner.query('DROP SCHEMA IF EXISTS public CASCADE');
    await queryRunner.query('CREATE SCHEMA public');
    await queryRunner.query(`GRANT ALL ON SCHEMA public TO ${DB_USERNAME}`);
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;');
    await queryRunner.release();

    // Re-sync the database
    await testDataSource.synchronize();
  } catch (error) {
    console.error('Error clearing test database:', error);
    throw error;
  }
};

export const closeTestDataSource = async () => {
  if (testDataSource.isInitialized) {
    await testDataSource.destroy();
  }
}; 