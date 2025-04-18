import * as yup from 'yup';
import { JobType, ExperienceLevel, JobStatus } from '../types/job';

export const createJobSchema = yup.object().shape({
  body: yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    company_name: yup.string().required('Company name is required'),
    location: yup.string().required('Location is required'),
    job_type: yup
      .string()
      .oneOf(['full-time', 'part-time', 'contract', 'internship'] as JobType[])
      .required('Job type is required'),
    experience_level: yup
      .string()
      .oneOf(['entry', 'mid', 'senior', 'lead'] as ExperienceLevel[])
      .required('Experience level is required'),
    salary_range: yup.string(),
    requirements: yup.string(),
    benefits: yup.string(),
    status: yup
      .string()
      .oneOf(['active', 'closed', 'draft'] as JobStatus[])
      .default('draft'),
    required_skills: yup.array().of(yup.number()),
    optional_skills: yup.array().of(yup.number()),
  }),
});

export const updateJobSchema = yup.object().shape({
  body: yup.object().shape({
    title: yup.string(),
    description: yup.string(),
    company_name: yup.string(),
    location: yup.string(),
    job_type: yup
      .string()
      .oneOf(['full-time', 'part-time', 'contract', 'internship'] as JobType[]),
    experience_level: yup
      .string()
      .oneOf(['entry', 'mid', 'senior', 'lead'] as ExperienceLevel[]),
    salary_range: yup.string(),
    requirements: yup.string(),
    benefits: yup.string(),
    status: yup
      .string()
      .oneOf(['active', 'closed', 'draft'] as JobStatus[]),
    required_skills: yup.array().of(yup.number()),
    optional_skills: yup.array().of(yup.number()),
  }),
});

export const searchJobsSchema = yup.object().shape({
  query: yup.object().shape({
    title: yup.string(),
    location: yup.string(),
    job_type: yup
      .string()
      .oneOf(['full-time', 'part-time', 'contract', 'internship'] as JobType[]),
    experience_level: yup
      .string()
      .oneOf(['entry', 'mid', 'senior', 'lead'] as ExperienceLevel[]),
    company_name: yup.string(),
    page: yup.number().min(1).default(1),
    limit: yup.number().min(1).max(100).default(10),
  }),
}); 