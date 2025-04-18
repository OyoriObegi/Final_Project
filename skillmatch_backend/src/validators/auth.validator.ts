import * as yup from 'yup';
import { UserRole } from '../types/user';

export const registerSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup
      .string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    role: yup
      .string()
      .oneOf(['job_seeker', 'employer'] as UserRole[])
      .required('Role is required'),
    phone_number: yup.string(),
    location: yup.string(),
    bio: yup.string(),
  }),
});

export const loginSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  }),
}); 