import { db } from '../config/database';
import { User } from '../types/user';

export class UserRepository {
  async create(userData: Omit<User, 'id'>) {
    const [user] = await db('users')
      .insert(userData)
      .returning('*');
    return user;
  }

  async findById(id: number) {
    return db('users')
      .where({ id })
      .first();
  }

  async findByEmail(email: string) {
    return db('users')
      .where({ email })
      .first();
  }

  async update(id: number, userData: Partial<User>) {
    const [user] = await db('users')
      .where({ id })
      .update(userData)
      .returning('*');
    return user;
  }

  async delete(id: number) {
    return db('users')
      .where({ id })
      .del();
  }
} 