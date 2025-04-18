import { beforeAll, afterAll } from '@jest/globals';
import dotenv from 'dotenv';
import { db } from '../config/database';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Global setup
beforeAll(async () => {
  // Run migrations
  await db.migrate.latest();
  
  // Run seeds if needed
  await db.seed.run();
});

// Global teardown
afterAll(async () => {
  // Rollback migrations
  await db.migrate.rollback();
  
  // Close database connection
  await db.destroy();
}); 