import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('applications', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('job_id').unsigned().notNullable();
    table.text('cover_letter').notNullable();
    table
      .enum('status', ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'])
      .notNullable()
      .defaultTo('pending');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('job_id').references('id').inTable('jobs').onDelete('CASCADE');

    // Unique constraint to prevent multiple applications from the same user for the same job
    table.unique(['user_id', 'job_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('applications');
} 