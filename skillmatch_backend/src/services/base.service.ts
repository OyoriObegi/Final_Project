import { Repository, DeepPartial, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { NotFoundError } from '../middleware/error.middleware';

export class BaseService<T extends ObjectLiteral> {
  constructor(protected repository: Repository<T>) {}

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } as any });
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    const savedEntity = await this.repository.save(entity);
    return savedEntity;
  }

  async update(id: string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, data as any);
    const updatedEntity = await this.findById(id);
    if (!updatedEntity) {
      throw new NotFoundError('Entity not found');
    }
    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async count(options: FindOptionsWhere<T> = {}): Promise<number> {
    return this.repository.count({ where: options });
  }

  async exists(options: FindOptionsWhere<T>): Promise<boolean> {
    const count = await this.repository.count({ where: options });
    return count > 0;
  }

  async findOne(options: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOne({ where: options });
  }

  async findOneOrFail(options: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.findOne(options);
    if (!entity) {
      throw new NotFoundError('Entity not found');
    }
    return entity;
  }
} 