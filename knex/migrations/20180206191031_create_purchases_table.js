
exports.up = function(knex, Promise) {
  return knex.schema.createTable(`purchases`, function(table) {
    table.increments().notNullable();
    table.integer(`user_id`).notNullable();
    table.foreign(`user_id`).references(`users.id`);
    table.integer(`products_id`).notNullable();
    table.foreign(`products_id`).references(`products.id`);
    table.timestamp(`created_at`).defaultTo(knex.fn.now());  
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(`purchases`);
};
