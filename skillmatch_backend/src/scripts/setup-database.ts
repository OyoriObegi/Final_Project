import { knex } from '../config/database';
import { seed as seedSkills } from '../seeds/01_skills';
import { seed as seedUsers } from '../seeds/02_users';
import { seed as seedUserSkills } from '../seeds/03_user_skills';
import { seed as seedJobs } from '../seeds/04_jobs';
import { seed as seedApplications } from '../seeds/05_applications';

async function setupDatabase() {
  try {
    console.log('Starting database setup...');

    // Run migrations
    console.log('Running migrations...');
    await knex.migrate.latest();
    console.log('Migrations completed successfully');

    // Run seeds in order
    console.log('Running seeds...');
    await seedSkills(knex);
    console.log('Skills seeded');
    
    await seedUsers(knex);
    console.log('Users seeded');
    
    await seedUserSkills(knex);
    console.log('User skills seeded');
    
    await seedJobs(knex);
    console.log('Jobs seeded');
    
    await seedApplications(knex);
    console.log('Applications seeded');

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await knex.destroy();
  }
}

setupDatabase(); 