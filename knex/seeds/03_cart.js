
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cart').del()
    .then(function () {
      // Inserts seed entries
      return knex('cart').insert([
        {
          user_id: 1,
          products_id: 1
        },
        {
          user_id: 1,
          products_id: 2
        },
        {
          user_id: 2,
          products_id: 3
        }
      ]);
    });
};
