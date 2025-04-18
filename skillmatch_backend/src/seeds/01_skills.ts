import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('skills').del();

  // Inserts seed entries
  await knex('skills').insert([
    // Technical Skills
    {
      name: 'JavaScript',
      category: 'Programming Languages',
      description: 'A programming language used for web development',
    },
    {
      name: 'TypeScript',
      category: 'Programming Languages',
      description: 'A typed superset of JavaScript that compiles to plain JavaScript',
    },
    {
      name: 'Python',
      category: 'Programming Languages',
      description: 'A high-level programming language known for its simplicity and versatility',
    },
    {
      name: 'Java',
      category: 'Programming Languages',
      description: 'A class-based, object-oriented programming language',
    },
    {
      name: 'React',
      category: 'Frontend Frameworks',
      description: 'A JavaScript library for building user interfaces',
    },
    {
      name: 'Angular',
      category: 'Frontend Frameworks',
      description: 'A TypeScript-based open-source web application framework',
    },
    {
      name: 'Node.js',
      category: 'Backend Technologies',
      description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    },
    {
      name: 'Express.js',
      category: 'Backend Technologies',
      description: 'A web application framework for Node.js',
    },
    {
      name: 'PostgreSQL',
      category: 'Databases',
      description: 'A powerful, open source object-relational database system',
    },
    {
      name: 'MongoDB',
      category: 'Databases',
      description: 'A NoSQL document database',
    },
    {
      name: 'Docker',
      category: 'DevOps',
      description: 'A platform for developing, shipping, and running applications in containers',
    },
    {
      name: 'AWS',
      category: 'Cloud Computing',
      description: 'Amazon Web Services cloud computing platform',
    },
    {
      name: 'Git',
      category: 'Version Control',
      description: 'A distributed version control system',
    },
    {
      name: 'RESTful API',
      category: 'API Development',
      description: 'Architectural style for designing networked applications',
    },
    {
      name: 'GraphQL',
      category: 'API Development',
      description: 'A query language for APIs and a runtime for fulfilling those queries',
    },

    // Soft Skills
    {
      name: 'Communication',
      category: 'Soft Skills',
      description: 'The ability to convey information effectively',
    },
    {
      name: 'Teamwork',
      category: 'Soft Skills',
      description: 'The ability to work effectively with others',
    },
    {
      name: 'Problem Solving',
      category: 'Soft Skills',
      description: 'The ability to find solutions to difficult or complex issues',
    },
    {
      name: 'Leadership',
      category: 'Soft Skills',
      description: 'The ability to guide and influence others',
    },
    {
      name: 'Time Management',
      category: 'Soft Skills',
      description: 'The ability to use time effectively and productively',
    },
    {
      name: 'Adaptability',
      category: 'Soft Skills',
      description: 'The ability to adjust to new conditions and environments',
    },
    {
      name: 'Critical Thinking',
      category: 'Soft Skills',
      description: 'The ability to analyze facts to form a judgment',
    },
    {
      name: 'Creativity',
      category: 'Soft Skills',
      description: 'The ability to generate new ideas and solutions',
    },
    {
      name: 'Emotional Intelligence',
      category: 'Soft Skills',
      description: 'The ability to understand and manage emotions',
    },
    {
      name: 'Conflict Resolution',
      category: 'Soft Skills',
      description: 'The ability to resolve disagreements effectively',
    },
  ]);
} 