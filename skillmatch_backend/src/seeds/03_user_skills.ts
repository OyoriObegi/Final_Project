import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('user_skills').del();

  // Get user IDs
  const users = await knex('users').select('id', 'role', 'email');
  const jobSeekers = users.filter(user => user.role === 'job_seeker');

  // Get skill IDs
  const skills = await knex('skills').select('id', 'name');

  // Create skill assignments for job seekers
  const userSkills = [];

  // John Doe's skills (Full-stack developer)
  const johnDoe = jobSeekers.find(user => user.email === 'john.doe@example.com');
  if (johnDoe) {
    userSkills.push(
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'JavaScript').id, proficiency_level: 4 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'TypeScript').id, proficiency_level: 3 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'React').id, proficiency_level: 4 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'Node.js').id, proficiency_level: 4 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'PostgreSQL').id, proficiency_level: 3 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'Git').id, proficiency_level: 4 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'Communication').id, proficiency_level: 4 },
      { user_id: johnDoe.id, skill_id: skills.find(s => s.name === 'Teamwork').id, proficiency_level: 4 }
    );
  }

  // Jane Smith's skills (Frontend developer)
  const janeSmith = jobSeekers.find(user => user.email === 'jane.smith@example.com');
  if (janeSmith) {
    userSkills.push(
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'JavaScript').id, proficiency_level: 5 },
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'TypeScript').id, proficiency_level: 5 },
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'React').id, proficiency_level: 5 },
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'Angular').id, proficiency_level: 4 },
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'Git').id, proficiency_level: 4 },
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'Communication').id, proficiency_level: 5 },
      { user_id: janeSmith.id, skill_id: skills.find(s => s.name === 'Creativity').id, proficiency_level: 5 }
    );
  }

  // Mike Johnson's skills (Backend developer)
  const mikeJohnson = jobSeekers.find(user => user.email === 'mike.johnson@example.com');
  if (mikeJohnson) {
    userSkills.push(
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'Python').id, proficiency_level: 5 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'Node.js').id, proficiency_level: 4 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'Express.js').id, proficiency_level: 4 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'PostgreSQL').id, proficiency_level: 4 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'MongoDB').id, proficiency_level: 3 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'Docker').id, proficiency_level: 3 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'Problem Solving').id, proficiency_level: 5 },
      { user_id: mikeJohnson.id, skill_id: skills.find(s => s.name === 'Critical Thinking').id, proficiency_level: 4 }
    );
  }

  // Insert user skills
  await knex('user_skills').insert(userSkills);
} 