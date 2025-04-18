import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserRequest, UpdateUserRequest, User, UserRole } from '../types/user';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: CreateUserRequest) {
    const { email, password, ...rest } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userRepository.create({
      email,
      password_hash: passwordHash,
      ...rest,
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string) {
    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret_key';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return token;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: number, userData: UpdateUserRequest) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If password is being updated, hash it
    if (userData.password) {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(userData.password, saltRounds);
      delete userData.password;
      Object.assign(userData, { password_hash });
    }

    const updatedUser = await this.userRepository.update(userId, {
      ...userData,
      updated_at: new Date(),
    });

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

export const authService = new AuthService(); 