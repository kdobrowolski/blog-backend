
exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary();
    table.string('username', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('password', 255).notNullable();
    table.string('firstName', 255).notNullable();
    table.string('lastName', 255).notNullable();
    table.boolean('isAdmin').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
