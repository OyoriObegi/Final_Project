import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('jobs', (table) => {
    table.increments('id').primary();
    table.integer('employer_id').notNullable().references('id').inTable('users');
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.string('company_name').notNullable();
    table.string('location').notNullable();
    table.string('job_type').notNullable();
    table.string('experience_level').notNullable();
    table.string('salary_range');
    table.text('requirements');
    table.text('benefits');
    table.string('status').notNullable().defaultTo('active');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('jobs');
} 