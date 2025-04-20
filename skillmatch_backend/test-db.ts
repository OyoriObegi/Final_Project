import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log('🔐 DB ENV CONFIG:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

client.connect()
  .then(() => {
    console.log('✅ Successfully connected to PostgreSQL');
    return client.end();
  })
  .catch((err: Error) => {
    console.error('❌ Connection failed:', err.message);
  }); 
  console.log('🔐 Loaded DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('🔐 Loaded DB_NAME:', process.env.DB_NAME);

  
