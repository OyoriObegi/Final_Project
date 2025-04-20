import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.controller';
import { User } from '../entities/User';
import { UserRole, UserStatus } from '../entities/User';
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../interfaces/user.interface';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { UserService } from '../services/user.service';
import AppDataSource from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class UserController extends BaseController<User> {
    private userRepository = AppDataSource.getRepository(User);

    constructor(userService: UserService) {
        super(userService);
    }

    public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: RegisterDTO = req.body;

            if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
                this.sendError(res, 400, 'All fields are required');
                return;
            }

            const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
            if (existingUser) {
                this.sendError(res, 400, 'Email already exists');
                return;
            }

            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);

            const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '24h' });
            
            this.sendResponse(res, 200, true, 'User registered successfully', {
                message: 'User registered successfully',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        } catch (error) {
            next(error);
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password }: LoginDTO = req.body;

            if (!email || !password) {
                this.sendError(res, 400, 'Email and password are required');
                return;
            }

            const user = await this.userRepository.findOne({ 
                where: { email },
                select: ['id', 'email', 'password', 'firstName', 'lastName', 'role', 'isActive', 'emailVerified']
            });
            
            if (!user) {
                this.sendError(res, 401, 'Invalid credentials');
                return;
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                this.sendError(res, 401, 'Invalid credentials');
                return;
            }

            if (!user.isActive) {
                this.sendError(res, 403, 'Account is deactivated');
                return;
            }

            const token = jwt.sign({ id: user.id }, config.jwtSecret, { expiresIn: '24h' });

            this.sendResponse(res, 200, true, 'Login successful', {
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    emailVerified: user.emailVerified
                }
            });
        } catch (error) {
            next(error);
        }
    };

    public updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                this.sendError(res, 401, 'Authentication required');
                return;
            }

            const updateData: Partial<User> = {
                ...req.body,
                skills: undefined // Skills are handled separately through a many-to-many relationship
            };

            const user = await this.userRepository.findOne({ 
                where: { id: userId },
                relations: ['skills']
            });
            
            if (!user) {
                this.sendError(res, 404, 'User not found');
                return;
            }

            this.userRepository.merge(user, updateData);
            await this.userRepository.save(user);

            this.sendResponse(res, 200, true, 'Profile updated successfully', {
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bio: user.bio,
                    skills: user.skills,
                    profilePicture: user.profilePicture
                }
            });
        } catch (error) {
            next(error);
        }
    };

    public changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                this.sendError(res, 401, 'Authentication required');
                return;
            }

            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                this.sendError(res, 400, 'Current password and new password are required');
                return;
            }

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                this.sendError(res, 404, 'User not found');
                return;
            }

            const isPasswordValid = await user.comparePassword(currentPassword);
            if (!isPasswordValid) {
                this.sendError(res, 401, 'Current password is incorrect');
                return;
            }

            user.password = newPassword;
            await this.userRepository.save(user);

            this.sendResponse(res, 200, true, 'Password changed successfully', {
                message: 'Password changed successfully'
            });
        } catch (error) {
            next(error);
        }
    };

    public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { token } = req.params;
            
            const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
            const user = await this.userRepository.findOne({ where: { id: decoded.userId } });

            if (!user) {
                this.sendError(res, 404, 'User not found');
                return;
            }

            user.emailVerified = true;
            user.verifiedAt = new Date();
            await this.userRepository.save(user);

            this.sendResponse(res, 200, true, 'Email verified successfully', {
                message: 'Email verified successfully'
            });
        } catch (error) {
            next(error);
        }
    };

    public deactivateAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                this.sendError(res, 401, 'Authentication required');
                return;
            }

            const { password } = req.body;

            if (!password) {
                this.sendError(res, 400, 'Password is required');
                return;
            }

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                this.sendError(res, 404, 'User not found');
                return;
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                this.sendError(res, 401, 'Invalid password');
                return;
            }

            user.isActive = false;
            await this.userRepository.save(user);

            this.sendResponse(res, 200, true, 'Account deactivated successfully', {
                message: 'Account deactivated successfully'
            });
        } catch (error) {
            next(error);
        }
    };

    public getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.user?.role !== UserRole.ADMIN) {
                this.sendError(res, 403, 'Unauthorized access');
                return;
            }

            const users = await this.userRepository.find({ 
                select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'emailVerified', 'status'] 
            });
            
            this.sendResponse(res, 200, true, 'Users retrieved successfully', { users });
        } catch (error) {
            next(error);
        }
    };

    public toggleUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.user?.role !== UserRole.ADMIN) {
                this.sendError(res, 403, 'Unauthorized access');
                return;
            }

            const { userId } = req.params;
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                this.sendError(res, 404, 'User not found');
                return;
            }

            user.isActive = !user.isActive;
            user.status = user.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
            if (!user.isActive) {
                user.suspendedAt = new Date();
            }
            
            await this.userRepository.save(user);

            this.sendResponse(res, 200, true, `User ${user.isActive ? 'activated' : 'deactivated'} successfully`, user);
        } catch (error) {
            next(error);
        }
    };

    public changeUserRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (req.user?.role !== UserRole.ADMIN) {
                this.sendError(res, 403, 'Unauthorized access');
                return;
            }

            const { userId } = req.params;
            const { role } = req.body;

            if (!Object.values(UserRole).includes(role)) {
                this.sendError(res, 400, 'Invalid role');
                return;
            }

            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                this.sendError(res, 404, 'User not found');
                return;
            }

            user.role = role;
            await this.userRepository.save(user);

            this.sendResponse(res, 200, true, 'User role updated successfully', {
                id: user.id,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            next(error);
        }
    };
}