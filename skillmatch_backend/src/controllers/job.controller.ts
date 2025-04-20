import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { Job } from '../entities/Job';
import { JobService } from '../services/job.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import AppDataSource from '../config/database';
import { UserRole } from '../entities/User';

export class JobController extends BaseController<Job> {
    private jobRepository = AppDataSource.getRepository(Job);

    constructor(jobService: JobService) {
        super(jobService);
    }

    public createJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user || req.user.role !== UserRole.RECRUITER) {
                this.sendError(res, 403, 'Only recruiters can create jobs');
                return;
            }

            const jobData = { ...req.body, employer: req.user };
            const job = this.jobRepository.create(jobData);
            await this.jobRepository.save(job);

            this.sendResponse(res, 201, true, 'Job created successfully', job);
        } catch (error) {
            next(error);
        }
    };

    public updateJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const job = await this.jobRepository.findOne({ 
                where: { id },
                relations: ['employer']
            });

            if (!job) {
                this.sendError(res, 404, 'Job not found');
                return;
            }

            if (!req.user || (job.employer.id !== req.user.id && req.user.role !== UserRole.ADMIN)) {
                this.sendError(res, 403, 'Unauthorized to update this job');
                return;
            }

            this.jobRepository.merge(job, req.body);
            await this.jobRepository.save(job);

            this.sendResponse(res, 200, true, 'Job updated successfully', job);
        } catch (error) {
            next(error);
        }
    };

    public deleteJob = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const job = await this.jobRepository.findOne({
                where: { id },
                relations: ['employer']
            });

            if (!job) {
                this.sendError(res, 404, 'Job not found');
                return;
            }

            if (!req.user || (job.employer.id !== req.user.id && req.user.role !== UserRole.ADMIN)) {
                this.sendError(res, 403, 'Unauthorized to delete this job');
                return;
            }

            await this.jobRepository.remove(job);
            this.sendResponse(res, 200, true, 'Job deleted successfully');
        } catch (error) {
            next(error);
        }
    };

    public getJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const job = await this.jobRepository.findOne({
                where: { id },
                relations: ['employer', 'skills']
            });

            if (!job) {
                this.sendError(res, 404, 'Job not found');
                return;
            }

            this.sendResponse(res, 200, true, 'Job retrieved successfully', job);
        } catch (error) {
            next(error);
        }
    };

    public getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const jobs = await this.jobRepository.find({
                relations: ['employer', 'skills'],
                order: { createdAt: 'DESC' }
            });

            this.sendResponse(res, 200, true, 'Jobs retrieved successfully', jobs);
        } catch (error) {
            next(error);
        }
    };
} 