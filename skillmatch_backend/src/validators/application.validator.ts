import * as yup from 'yup';
import { ApplicationStatus } from '../types/application';

export const createApplicationSchema = yup.object().shape({
  body: yup.object().shape({
    job_id: yup.number().required('Job ID is required'),
    cover_letter: yup.string().required('Cover letter is required'),
  }),
});

export const updateApplicationSchema = yup.object().shape({
  body: yup.object().shape({
    status: yup
      .string()
      .oneOf(
        ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'] as ApplicationStatus[]
      )
      .required('Status is required'),
  }),
}); 