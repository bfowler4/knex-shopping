
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          email: `brandon@devleague.com`,
          password: `brandon`
        },
        {
          email: `alex@devleague.com`,
          password: `alex`
        },
        {
          email: `brad@devleague.com`,
          password: `brad`
        }
      ]);
    });
};
