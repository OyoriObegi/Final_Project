import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('applications').del();

  // Get user IDs
  const users = await knex('users')
    .select('id', 'email')
    .where('role', 'job_seeker');

  // Get job IDs
  const jobs = await knex('jobs')
    .select('id', 'title')
    .where('status', 'active');

  // Create applications
  const applications = [
    {
      user_id: users.find(u => u.email === 'john.doe@example.com')?.id,
      job_id: jobs.find(j => j.title === 'Senior Software Engineer')?.id,
      cover_letter: 'I am excited to apply for the Senior Software Engineer position. With my 5+ years of experience in full-stack development, I believe I would be a great fit for your team.',
      status: 'pending'
    },
    {
      user_id: users.find(u => u.email === 'jane.smith@example.com')?.id,
      job_id: jobs.find(j => j.title === 'Product Manager')?.id,
      cover_letter: 'I am writing to express my interest in the Product Manager position. My experience in agile development and user research aligns well with your requirements.',
      status: 'reviewed'
    },
    {
      user_id: users.find(u => u.email === 'alice.johnson@example.com')?.id,
      job_id: jobs.find(j => j.title === 'UX Designer')?.id,
      cover_letter: 'As a passionate UX Designer with a strong portfolio in user-centered design, I am eager to contribute to your design team.',
      status: 'shortlisted'
    },
    {
      user_id: users.find(u => u.email === 'john.doe@example.com')?.id,
      job_id: jobs.find(j => j.title === 'Product Manager')?.id,
      cover_letter: 'While my primary experience is in software development, I have been transitioning into product management and would love the opportunity to grow in this role.',
      status: 'accepted'
    },
    {
      user_id: users.find(u => u.email === 'jane.smith@example.com')?.id,
      job_id: jobs.find(j => j.title === 'Senior Software Engineer')?.id,
      cover_letter: 'I am applying for the Senior Software Engineer position. My experience with modern web technologies and leadership skills make me a strong candidate.',
      status: 'rejected'
    }
  ];

  // Insert applications
  await knex('applications').insert(applications);
} 