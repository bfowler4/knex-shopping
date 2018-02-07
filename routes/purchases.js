const express = require(`express`);
const router = express.Router();
const knex = require('../knex/knex.js');
module.exports = router;

router.get(`/:user_id`, (req, res) => {
  return knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    } else {
      throw Error(`User was not found`);
    }
  })
  .then((getPurchases) => {
    return knex.raw(`SELECT * FROM purchases WHERE purchases.user_id = ?`, [req.params.user_id]);
  })
  .then((purchases) => {
    if (purchases.rows.length) {
      return res.json(purchases.rows);
    } else {
      return res.json({ message: `User has no recorded purchases` });
    }
  })
  .catch((err) => {
    return res.json({ message: err.message });
  })
})
.get(`/:user_id/:month/:year`, (req, res) => {
  return knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    } else {
      throw Error(`User was not found`);
    }
  })
  .then((getPurchases) => {
    return knex.raw(createTimeFrameQuery(req.params), [req.params.user_id]);
  })
  .then((purchases) => {
    if (purchases.rows.length) {
      return res.json(purchases.rows);
    } else {
      return res.json({ message: `No purchases from the given timeframe` });
    }
  })
  .catch((err) => {
    return res.json({ message: err.message });
  })
})
.post(`/:user_id/checkout/:product_id`, (req, res) => {
  return knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    } else {
      throw Error(`User was not found`);
    }
  })
  .then((findProduct) => {
    return knex.raw(`SELECT * FROM products WHERE products.id = ?`, [req.params.product_id]);
  })
  .then((foundProduct) => {
    if (foundProduct.rows.length) {
      return foundProduct;
    } else {
      throw Error(`Product was not found`);
    }
  })
  .then((updateInventory) => {
    return knex.raw(`UPDATE products SET inventory = (inventory - 1) WHERE products.id = ? AND products.inventory > 0`, [req.params.product_id]);
  })
  .then((updatedInventory) => {
    if (updatedInventory.rowCount) {
      return updatedInventory;
    } else {
      throw Error(`Product is currently out of stock`);
    }
  })
  .then((logPurchase) => {
    return knex.raw(`INSERT INTO purchases (user_id, products_id) VALUES (?, ?)`, [req.params.user_id, req.params.product_id]);
  })
  .then((result) => {
    return res.json({ message: `Purchase was successful!` });
  })
  .catch((err) => {
    return res.json({ message: err.message });
  })
});


function createTimeFrameQuery(arguments) {
  return `SELECT * FROM purchases WHERE purchases.user_id = ? AND purchases.created_at > timestamp '${arguments.year}-${arguments.month}-1'`;
}