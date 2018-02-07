const express = require(`express`);
const router = express.Router();
const knex = require('../knex/knex.js');
const doError = require(`../utilities/errorHandler`);
const { findUser, findProduct } = require(`../utilities/databaseFinder`)
module.exports = router;

router.get(`/:user_id`, (req, res) => {
  findUser(req.params.user_id)
  .then((getUserProducts) => {
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
    doError(err, res);
  });
})
.post(`/:user_id/:product_id`, (req, res) => {
  findUser(req.params.user_id)
  .then((checkProduct) => {
    return findProduct(req.params.product_id);
  })
  .then((insertProduct) => {
    return knex.raw(`INSERT INTO cart (user_id, products_id) VALUES (?, ?)`, [req.params.user_id, req.params.product_id]);
  })
  .then((success) => {
    return res.json({ success: `true` });
  })
  .catch((err) => {
    doError(err, res);
  })
})
.delete(`/:user_id/:product_id`, (req, res) => {
  findUser(req.params.user_id)
  .then((checkProduct) => {
    return findProduct(req.params.product_id);
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
    doError(err, res);
  })
});