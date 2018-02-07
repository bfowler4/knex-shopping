const express = require(`express`);
const router = express.Router();
const knex = require('../knex/knex.js');
module.exports = router;

router.get(`/:user_id`, (req, res) => {
  return knex.raw(`SELECT * FROM users where users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    } else {
      throw Error(`User was not found`);
    }
  })
  .then((user) => {
    return knex.raw(`SELECT products.id, products.title, products.description, products.price, count(*) FROM products INNER JOIN cart ON cart.products_id = products.id INNER JOIN users ON users.id = cart.user_id WHERE users.id = ? GROUP BY products.id`, [req.params.user_id])
  })
  .then((productList) => {
    if (productList.rows.length) {
      return res.json(productList.rows);
    } else {
      return res.json({ message: `User has no items in cart` });
    }
  })
  .catch((err) => {
    return res.json({ message: err.message });
  });
})
.post(`/:user_id/:product_id`, (req, res) => {
  return knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    } else {
      throw Error(`User was not found`);
    }
  })
  .then((checkProduct) => {
    return knex.raw(`SELECT * FROM products WHERE products.id = ?`, [req.params.product_id]);
  })
  .then((foundProduct) => {
    if (foundProduct.rows.length) {
      return foundProduct;
    } else {
      throw Error(`Product was not found`);
    }
  })
  .then((insertProduct) => {
    return knex.raw(`INSERT INTO cart (user_id, products_id) VALUES (?, ?)`, [req.params.user_id, req.params.product_id]);
  })
  .then((success) => {
    return res.json({ success: `true` });
  })
  .catch((err) => {
    return res.json({ message: err.message });
  })
})
.delete(`/:user_id/:product_id`, (req, res) => {
  return knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    } else {
      throw Error(`User was not found`)
    }
  })
  .then((checkProduct) => {
    return knex.raw(`SELECT * FROM products WHERE products.id = ?`, [req.params.product_id]);
  })
  .then((foundProduct) => {
    if (foundProduct.rows.length) {
      return foundProduct;
    } else {
      throw Error(`Product was not found`);
    }
  })
  .then((deleteProduct) => {
    return knex.raw(`DELETE FROM cart WHERE cart.user_id = ? AND cart.products_id = ?`, [req.params.user_id, req.params.product_id]);
  })
  .then((deleteResult) => {
    if (deleteResult.rowCount) {
      return res.json({ success: `true` });
    } else {
      return res.json({ message: `User did not have any of that product in their cart` });
    }
  })
  .catch((err) => {
    return res.json({ message: err.message });
  })
});