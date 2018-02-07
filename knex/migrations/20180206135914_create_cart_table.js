
exports.up = function(knex, Promise) {
  return knex.schema.createTable(`cart`, function(table) {
    table.increments().notNullable();
    table.integer(`user_id`).notNullable();
    table.foreign(`user_id`).references(`users.id`).onDelete(`CASCADE`);
    table.integer(`products_id`).notNullable();
    table.foreign(`products_id`).references(`products.id`).onDelete(`CASCADE`);
    table.timestamp(`created_at`).defaultTo(knex.fn.now());
    table.timestamp(`updated_at`).defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(`cart`);
};
