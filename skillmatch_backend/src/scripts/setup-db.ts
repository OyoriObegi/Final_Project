import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    // Read and execute migration files
    const migrationFiles = fs.readdirSync(path.join(__dirname, '../database/migrations'))
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const migration = fs.readFileSync(path.join(__dirname, '../database/migrations', file), 'utf8');
      console.log(`Running migration: ${file}`);
      await client.query(migration);
    }
    console.log('All migrations completed successfully');
  } catch (err) {
    console.error('Error running migrations:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function runSeeds() {
  const client = await pool.connect();
  try {
    // Read and execute seed files
    const seedFiles = fs.readdirSync(path.join(__dirname, '../database/seeds'))
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of seedFiles) {
      const seed = fs.readFileSync(path.join(__dirname, '../database/seeds', file), 'utf8');
      console.log(`Running seed: ${file}`);
      await client.query(seed);
    }
    console.log('All seeds completed successfully');
  } catch (err) {
    console.error('Error running seeds:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function setupDatabase() {
  try {
    await runMigrations();
    await runSeeds();
    console.log('Database setup completed successfully');
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 