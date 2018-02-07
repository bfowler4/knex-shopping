
exports.up = function(knex, Promise) {
  return knex.schema.table(`products`, function(table) {
    table.unique(`title`);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table(`products`, function(table) {
    table.dropUnique(`title`);
  });
};
