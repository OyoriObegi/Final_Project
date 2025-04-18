import { describe, it, expect, afterAll } from '@jest/globals';
import { db } from '../config/database';

describe('Database Connection', () => {
  afterAll(async () => {
    // Close the database connection
    await db.destroy();
  });

  it('should connect to the development database', async () => {
    try {
      const result = await db.raw('SELECT current_database() as db_name');
      const dbName = result.rows[0].db_name;
      console.log('Connected to database:', dbName);
      expect(dbName).toBeDefined();
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  });

  it('should be able to create and query a test table', async () => {
    try {
      // Create a temporary test table
      await db.schema.createTable('test_table', (table) => {
        table.increments('id');
        table.string('name');
      });

      // Insert test data
      await db('test_table').insert({ name: 'test' });

      // Query the data
      const result = await db('test_table').select('*');
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('test');

      // Clean up
      await db.schema.dropTable('test_table');
    } catch (error) {
      console.error('Test table operation error:', error);
      throw error;
    }
  });
}); 