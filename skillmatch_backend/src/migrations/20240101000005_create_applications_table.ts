import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('applications', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('job_id').notNullable().references('id').inTable('jobs').onDelete('CASCADE');
    table.text('cover_letter').notNullable();
    table.string('status').notNullable().defaultTo('pending');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    
    // Add unique constraint to prevent duplicate applications
    table.unique(['user_id', 'job_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('applications');
} 