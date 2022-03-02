
exports.up = function(knex) {
  return knex.schema.createTable('posts', function (table) {
    table.increments('id').primary();
    table.integer('userId').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('title').notNullable();
    table.string('mainImage').notNullable();
    table.text('content').notNullable();
    table.text('description').notNullable();
    table.string('tags').notNullable();
  });
};

exports.down = function(knex) {

};
