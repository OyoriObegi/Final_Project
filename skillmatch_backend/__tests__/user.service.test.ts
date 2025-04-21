import { DataSource } from 'typeorm';
import { UserService } from '../src/services/user.service';
import { User, UserRole, UserStatus } from '../src/entities/User';
import { createTestDataSource } from './helpers/test-utils';
import { AuthenticationError, ValidationError } from '../src/utils/errors';
import bcrypt from 'bcrypt';

describe('UserService', () => {
  let dataSource: DataSource;
  let userService: UserService;
  let testUser: User;

  beforeAll(async () => {
    dataSource = await createTestDataSource();
    userService = new UserService(dataSource);
  });

  beforeEach(async () => {
    // Clear the database before each test
    await dataSource.getRepository(User).clear();

    // Create a test user
    testUser = await dataSource.getRepository(User).save({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: UserRole.SEEKER,
      status: UserStatus.ACTIVE,
      isActive: true,
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: UserRole.SEEKER,
      };

      const user = await userService.register(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
    });

    it('should throw ValidationError if email already exists', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com', // Same email as testUser
        password: 'password123',
        role: UserRole.SEEKER,
      };

      await expect(userService.register(userData)).rejects.toThrow(ValidationError);
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const result = await userService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.email).toBe(testUser.email);
    });

    it('should throw AuthenticationError with incorrect password', async () => {
      await expect(
        userService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError with non-existent email', async () => {
      await expect(
        userService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const updatedUser = await userService.updateProfile(testUser.id, updateData);

      expect(updatedUser.firstName).toBe(updateData.firstName);
      expect(updatedUser.lastName).toBe(updateData.lastName);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const newPassword = 'newpassword123';

      await userService.changePassword(testUser.id, 'password123', newPassword);

      const updatedUser = await dataSource.getRepository(User).findOneBy({ id: testUser.id });
      expect(await bcrypt.compare(newPassword, updatedUser.password)).toBe(true);
    });

    it('should throw AuthenticationError with incorrect current password', async () => {
      await expect(
        userService.changePassword(testUser.id, 'wrongpassword', 'newpassword123')
      ).rejects.toThrow(AuthenticationError);
    });
  });

  describe('findUsers', () => {
    it('should find users by role', async () => {
      const users = await userService.findUsers({ role: UserRole.SEEKER });
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(UserRole.SEEKER);
    });

    it('should find users by status', async () => {
      const users = await userService.findUsers({ status: UserStatus.ACTIVE });
      expect(users).toHaveLength(1);
      expect(users[0].status).toBe(UserStatus.ACTIVE);
    });
  });

  describe('toggleUserStatus', () => {
    it('should toggle user status', async () => {
      const updatedUser = await userService.toggleUserStatus(testUser.id);
      expect(updatedUser.isActive).toBe(false);
    });
  });

  describe('changeUserRole', () => {
    it('should change user role', async () => {
      const updatedUser = await userService.changeUserRole(testUser.id, UserRole.RECRUITER);
      expect(updatedUser.role).toBe(UserRole.RECRUITER);
    });
  });
}); 