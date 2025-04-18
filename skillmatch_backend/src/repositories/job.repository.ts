import { db } from '../config/database';
import { Job, JobSkill } from '../types/job';
import { JobFilters } from '../types/filters';

export class JobRepository {
  async create(jobData: Omit<Job, 'id'>) {
    const [job] = await db('jobs')
      .insert({
        title: jobData.title,
        description: jobData.description,
        company: jobData.company,
        location: jobData.location,
        salary: jobData.salary,
        postedBy: jobData.postedBy,
        postedDate: jobData.postedDate,
        applicationDeadline: jobData.applicationDeadline
      })
      .returning('*');
    return job;
  }

  async findById(id: number) {
    return db('jobs')
      .where({ id })
      .first();
  }

  async update(id: number, jobData: Partial<Job>) {
    const [job] = await db('jobs')
      .where({ id })
      .update({
        title: jobData.title,
        description: jobData.description,
        company: jobData.company,
        location: jobData.location,
        salary: jobData.salary,
        applicationDeadline: jobData.applicationDeadline
      })
      .returning('*');
    return job;
  }

  async findAll(filters?: JobFilters) {
    const query = db('jobs')
      .select('*')
      .modify((queryBuilder: any) => {
        if (filters?.title) {
          queryBuilder.whereILike('title', `%${filters.title}%`);
        }
        if (filters?.company) {
          queryBuilder.whereILike('company', `%${filters.company}%`);
        }
        if (filters?.location) {
          queryBuilder.whereILike('location', `%${filters.location}%`);
        }
        if (filters?.minSalary) {
          queryBuilder.where('salary', '>=', filters.minSalary);
        }
        if (filters?.maxSalary) {
          queryBuilder.where('salary', '<=', filters.maxSalary);
        }
        if (filters?.postedBy) {
          queryBuilder.where('postedBy', filters.postedBy);
        }
        if (filters?.fromDate) {
          queryBuilder.where('postedDate', '>=', filters.fromDate);
        }
        if (filters?.toDate) {
          queryBuilder.where('postedDate', '<=', filters.toDate);
        }
      })
      .orderBy('postedDate', 'desc');

    return query;
  }

  async delete(id: number) {
    return db('jobs')
      .where({ id })
      .del();
  }

  async getJobSkills(jobId: number) {
    const requiredSkills = await db('job_skills')
      .select('skill')
      .where({ jobId, isRequired: true });

    const optionalSkills = await db('job_skills')
      .select('skill')
      .where({ jobId, isRequired: false });

    return {
      requiredSkills: requiredSkills.map(s => s.skill),
      optionalSkills: optionalSkills.map(s => s.skill)
    };
  }

  async addJobSkills(jobId: number, skills: JobSkill[]) {
    const jobSkills = skills.map(skill => ({
      jobId,
      skill: skill.name,
      isRequired: skill.isRequired
    }));

    await db('job_skills').insert(jobSkills);
  }

  async updateJobSkills(jobId: number, skills: JobSkill[]) {
    await db('job_skills')
      .where({ jobId })
      .del();

    return this.addJobSkills(jobId, skills);
  }
} 