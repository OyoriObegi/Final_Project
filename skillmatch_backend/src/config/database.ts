import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/database/migrations'
  },
  seeds: {
    directory: './src/database/seeds'
  }
};

export const db = knex(config);
export default config; 