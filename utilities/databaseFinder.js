const knex = require('../knex/knex.js');
module.exports = {
  findUser,
  findProduct
}


function findUser(id) {
  return knex.raw(`SELECT * FROM users where users.id = ?`, [id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser.rows[0];
    } else {
      throw Error(`User was not found`);
    }
  });
}

function findProduct(id) {
  return knex.raw(`SELECT * FROM products WHERE products.id = ?`, [id])
  .then((foundProduct) => {
    if (foundProduct.rows.length) {
      console.log(`here`);
      return foundProduct.rows[0];
    } else {
      throw Error(`Product was not found`);
    }
  })
}