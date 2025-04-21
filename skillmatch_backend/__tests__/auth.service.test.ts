import { DataSource } from 'typeorm';
import { AuthService } from '../src/services/auth.service';
import { UserService } from '../src/services/user.service';
import { User, UserRole, UserStatus } from '../src/entities/User';
import { Job } from '../src/entities/Job';
import { JobApplication } from '../src/entities/JobApplication';
import { Skill } from '../src/entities/Skill';
import { Portfolio } from '../src/entities/Portfolio';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setupTestDatabase, cleanupTestData, closeTestDatabase } from './helpers/test-utils';
import AppDataSource from '../src/config/database';

describe('AuthService', () => {
  let dataSource: DataSource;
  let authService: AuthService;
  let userService: UserService;
  let testUser: User;

  beforeAll(async () => {
    await setupTestDatabase();
    dataSource = AppDataSource;
    userService = new UserService(dataSource);
    authService = new AuthService();
  });

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await userService.register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.SEEKER
    });
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error with incorrect password', async () => {
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid password');
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow('User not found');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const newUser = await authService.register({
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.SEEKER
      });

      expect(newUser).toBeDefined();
      expect(newUser.email).toBe('newuser@example.com');
      expect(newUser.firstName).toBe('New');
      expect(newUser.lastName).toBe('User');
    });

    it('should throw error when registering with existing email', async () => {
      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          role: UserRole.SEEKER
        })
      ).rejects.toThrow('User already exists');
    });
  });

  describe('validateToken', () => {
    it('should validate a valid token', async () => {
      const token = jwt.sign(
        { userId: testUser.id, role: testUser.role },
        process.env.JWT_SECRET || 'your-secret-key'
      );

      const result = await authService.validateToken(token);
      expect(result).toBeDefined();
      expect(result.userId).toBe(testUser.id);
      expect(result.role).toBe(testUser.role);
    });

    it('should throw error for invalid token', async () => {
      await expect(authService.validateToken('invalid-token')).rejects.toThrow('Invalid token');
    });
  });
}); 