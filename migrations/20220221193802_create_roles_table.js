
exports.up = function(knex) {
    return knex.schema.createTable('roles', function (table) {
      table.integer('userId').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('role').notNullable();
      table.primary(['userId', 'role']);
    });
  };

exports.down = function(knex) {
  
};
