
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('products').del()
    .then(function () {
      // Inserts seed entries
      return knex('products').insert([
        {
          title: `Hydroflask`,
          description: `40 ounce black hydroflask water bottle`,
          inventory: 100,
          price: 30.99
        },
        {
          title: `iPhone 6`,
          description: `iPhone 6 with cracked screen`,
          inventory: 20,
          price: 20.00
        },
        {
          title: `Duck`,
          description: `yellow rubber duck toy`,
          inventory: 250,
          price: 1.99
        }
      ]);
    });
};
