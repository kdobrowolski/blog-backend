
exports.up = function(knex) {
  return knex.schema.createTable('reactions', function (table) {
    table.increments('id').primary();
    table.string('reactionType').notNullable();
    table.string('userIp').notNullable();
    table.integer('postId').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    table.unique(['userIp', 'postId']);
  });
};

exports.down = function(knex) {

};
