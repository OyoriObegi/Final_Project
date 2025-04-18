import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_skills', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE');
    table.integer('proficiency_level').notNullable().defaultTo(1);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    
    // Add unique constraint to prevent duplicate skill assignments
    table.unique(['user_id', 'skill_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('user_skills');
} 