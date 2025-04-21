import AppDataSource from '../config/database';
import { Skill, SkillType } from '../entities/Skill';

async function seedSkills() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Connected to DB...');

    const skillRepository = AppDataSource.getRepository(Skill);

    const skillsData: Partial<Skill>[] = [
      {
        name: 'JavaScript',
        slug: 'javascript',
        description: 'Versatile scripting language for web development.',
        type: SkillType.TECHNICAL,
        keywords: ['js', 'frontend', 'web'],
        isVerified: true
      },
      {
        name: 'Teamwork',
        slug: 'teamwork',
        description: 'Ability to work effectively in teams.',
        type: SkillType.SOFT,
        keywords: ['collaboration', 'communication'],
        isVerified: true
      },
      {
        name: 'Project Management',
        slug: 'project-management',
        description: 'Planning, executing, and overseeing projects.',
        type: SkillType.TOOL,
        keywords: ['agile', 'scrum', 'planning'],
        isVerified: true
      }
    ];

    for (const data of skillsData) {
      const existing = await skillRepository.findOne({ where: { name: data.name } });
      if (!existing) {
        const skill = skillRepository.create(data);
        await skillRepository.save(skill);
        console.log(`✅ Inserted: ${data.name}`);
      } else {
        console.log(`⚠️ Already exists: ${data.name}`);
      }
    }

    await AppDataSource.destroy();
    console.log('✅ Seeding complete');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

seedSkills();
