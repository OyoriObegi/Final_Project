import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('jobs').del();

  // Get employer IDs
  const employers = await knex('users')
    .where('role', 'employer')
    .select('id', 'email');

  // Get skill IDs
  const skills = await knex('skills').select('id', 'name');

  // Create job postings
  const jobs = [
    {
      employer_id: employers.find(e => e.email === 'hr@techcorp.com').id,
      title: 'Senior Frontend Developer',
      description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications using React and TypeScript.',
      company_name: 'Tech Corp',
      location: 'San Francisco, USA',
      job_type: 'full-time',
      experience_level: 'senior',
      salary_range: '$120,000 - $150,000',
      requirements: '5+ years of experience with React and TypeScript, strong understanding of web development principles, experience with state management libraries',
      benefits: 'Health insurance, 401(k) matching, flexible work hours, remote work options',
      status: 'active',
    },
    {
      employer_id: employers.find(e => e.email === 'careers@innovate.com').id,
      title: 'Backend Developer',
      description: 'Join our innovative team as a Backend Developer. You will work on building scalable APIs and microservices using Node.js and Python.',
      company_name: 'Innovate Labs',
      location: 'Berlin, Germany',
      job_type: 'full-time',
      experience_level: 'mid-level',
      salary_range: '€70,000 - €90,000',
      requirements: '3+ years of experience with Node.js or Python, experience with RESTful APIs, knowledge of database design',
      benefits: 'Competitive salary, flexible working hours, professional development budget',
      status: 'active',
    },
    {
      employer_id: employers.find(e => e.email === 'jobs@digital.com').id,
      title: 'Full Stack Developer',
      description: 'We are seeking a Full Stack Developer to work on our digital transformation projects. You will be involved in both frontend and backend development.',
      company_name: 'Digital Solutions',
      location: 'Sydney, Australia',
      job_type: 'full-time',
      experience_level: 'mid-level',
      salary_range: 'AUD 100,000 - AUD 130,000',
      requirements: 'Experience with JavaScript/TypeScript, Node.js, and a frontend framework, understanding of database systems',
      benefits: 'Work from home options, health insurance, annual bonus',
      status: 'active',
    },
  ];

  // Insert jobs and get their IDs
  const jobIds = await knex('jobs').insert(jobs).returning('id');

  // Create job skills
  const jobSkills = [];

  // Senior Frontend Developer skills
  jobSkills.push(
    { job_id: jobIds[0], skill_id: skills.find(s => s.name === 'JavaScript').id, is_required: true },
    { job_id: jobIds[0], skill_id: skills.find(s => s.name === 'TypeScript').id, is_required: true },
    { job_id: jobIds[0], skill_id: skills.find(s => s.name === 'React').id, is_required: true },
    { job_id: jobIds[0], skill_id: skills.find(s => s.name === 'Git').id, is_required: true },
    { job_id: jobIds[0], skill_id: skills.find(s => s.name === 'Communication').id, is_required: true }
  );

  // Backend Developer skills
  jobSkills.push(
    { job_id: jobIds[1], skill_id: skills.find(s => s.name === 'Node.js').id, is_required: true },
    { job_id: jobIds[1], skill_id: skills.find(s => s.name === 'Python').id, is_required: false },
    { job_id: jobIds[1], skill_id: skills.find(s => s.name === 'Express.js').id, is_required: true },
    { job_id: jobIds[1], skill_id: skills.find(s => s.name === 'PostgreSQL').id, is_required: true },
    { job_id: jobIds[1], skill_id: skills.find(s => s.name === 'Problem Solving').id, is_required: true }
  );

  // Full Stack Developer skills
  jobSkills.push(
    { job_id: jobIds[2], skill_id: skills.find(s => s.name === 'JavaScript').id, is_required: true },
    { job_id: jobIds[2], skill_id: skills.find(s => s.name === 'Node.js').id, is_required: true },
    { job_id: jobIds[2], skill_id: skills.find(s => s.name === 'React').id, is_required: true },
    { job_id: jobIds[2], skill_id: skills.find(s => s.name === 'PostgreSQL').id, is_required: true },
    { job_id: jobIds[2], skill_id: skills.find(s => s.name === 'Teamwork').id, is_required: true }
  );

  // Insert job skills
  await knex('job_skills').insert(jobSkills);
} 