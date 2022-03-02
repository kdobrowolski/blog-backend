
exports.up = function(knex) {
    return knex.schema.createTable('comments', function (table) {
      table.increments('id').primary();
      table.string('fullname').notNullable();
      table.string('content').notNullable();
      table.timestamp('date');
      table.integer('postId').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    });
  };

exports.down = function(knex) {
  
};
