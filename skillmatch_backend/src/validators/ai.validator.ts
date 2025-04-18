import * as yup from 'yup';

export const analyzeApplicationSchema = yup.object({
  cover_letter: yup.string().required('Cover letter is required'),
  job_description: yup.string().required('Job description is required')
});

export const generateCoverLetterSchema = yup.object({
  job_description: yup.string().required('Job description is required'),
  skills: yup.array().of(yup.string()).required('Skills are required')
});

export const analyzeJobSkillsSchema = yup.object({
  job_description: yup.string().required('Job description is required')
}); 