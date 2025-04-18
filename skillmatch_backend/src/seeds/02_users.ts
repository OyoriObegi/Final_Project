import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Hash passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Inserts seed entries
  await knex('users').insert([
    // Job Seekers
    {
      email: 'john.doe@example.com',
      password_hash: passwordHash,
      first_name: 'John',
      last_name: 'Doe',
      role: 'job_seeker',
      phone_number: '+1234567890',
      location: 'New York, USA',
      bio: 'Full-stack developer with 5 years of experience in web development',
      is_verified: true,
    },
    {
      email: 'jane.smith@example.com',
      password_hash: passwordHash,
      first_name: 'Jane',
      last_name: 'Smith',
      role: 'job_seeker',
      phone_number: '+1987654321',
      location: 'London, UK',
      bio: 'Frontend developer specializing in React and TypeScript',
      is_verified: true,
    },
    {
      email: 'mike.johnson@example.com',
      password_hash: passwordHash,
      first_name: 'Mike',
      last_name: 'Johnson',
      role: 'job_seeker',
      phone_number: '+1122334455',
      location: 'Toronto, Canada',
      bio: 'Backend developer with expertise in Node.js and Python',
      is_verified: true,
    },

    // Employers
    {
      email: 'hr@techcorp.com',
      password_hash: passwordHash,
      first_name: 'Tech',
      last_name: 'Corp',
      role: 'employer',
      phone_number: '+1999888777',
      location: 'San Francisco, USA',
      bio: 'Leading technology company specializing in software solutions',
      is_verified: true,
    },
    {
      email: 'careers@innovate.com',
      password_hash: passwordHash,
      first_name: 'Innovate',
      last_name: 'Labs',
      role: 'employer',
      phone_number: '+1444555666',
      location: 'Berlin, Germany',
      bio: 'Innovative startup focused on AI and machine learning',
      is_verified: true,
    },
    {
      email: 'jobs@digital.com',
      password_hash: passwordHash,
      first_name: 'Digital',
      last_name: 'Solutions',
      role: 'employer',
      phone_number: '+1666777888',
      location: 'Sydney, Australia',
      bio: 'Digital transformation company helping businesses grow',
      is_verified: true,
    },
  ]);
} 