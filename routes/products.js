const express = require(`express`);
const router = express.Router();
const knex = require('../knex/knex.js');
module.exports = router;

router.get(`/`, (req, res) => {
  return knex.raw(`SELECT * FROM products`)
  .then((productList) => {
    return res.json(productList.rows);
  });
})
.get(`/:product_id`, (req, res) => {
  return knex.raw(`SELECT * FROM products WHERE products.id = ?`, [req.params.product_id])
  .then((product) => {
    if (product.rows.length) {
      return res.json(product.rows[0]);
    } else {
      return res.json({ message: `Product not found` });
    }
  });
})
.post(`/new`, (req, res) => {
  if (!validateProduct(req.body)) {
    return res.json({ message: `Must POST all product fields` });
  }
  return knex.raw(`INSERT INTO products (title, description, inventory, price) VALUES (?, ?, ?, ?) RETURNING *`, [req.body.title, req.body.description, req.body.inventory, req.body.price])
  .then((product) => {
    return res.json(product.rows[0]);
  });
})
.put(`/:product_id`, (req, res) => {
  return knex.raw(`SELECT * FROM products WHERE products.id = ?`, [req.params.product_id])
  .then((product) => {
    if (product.rows.length) {
      return product;
    } else {
      throw Error(`Product was not found`);
    }
  })
  .then((product) => {
    let updateArgs = convertObjectToArray(req.body).concat([parseFloat(req.params.product_id)]);
    return knex.raw(createUpdateQuery(req.body), updateArgs);
  })
  .then((updatedProduct) => {
      return res.json(updatedProduct.rows[0]);
  })
  .catch((err) => {
    return res.json({ message: err.message });
  });
})
.delete(`/:product_id`, (req, res) => {
  return knex.raw(`DELETE FROM products WHERE products.id = ?`, [req.params.product_id])
  .then((deleteResult) => {
    if (deleteResult.rowCount) {
      return res.json({ message: `Product id: ${req.params.product_id} successfully deleted` });
    } else {
      return res.json({ message: `Product id: ${req.params.product_id} not found` });
    }
  })
});


function validateProduct(product) {
  let productKeys = [`title`, `description`, `inventory`, `price`];
  if (Object.keys(product).length !== 4) {
    return false;
  }

  for (let key of productKeys) {
    if (!product.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function convertObjectToArray(obj) {
  return Object.keys(obj).reduce((accum, curr) => {
    if (curr === `price` || curr === `inventory`) {
      accum.push(parseFloat(obj[curr]));
    } else {
      accum.push(obj[curr]);
    }
    return accum;
  }, []);
}

function createUpdateQuery(obj) {
  let result =  Object.keys(obj).reduce((accum, curr, index) => {
    if (index === 0) {
      accum += `${curr} = ?`
    } else {
      accum += `, ${curr} = ?`;
    }
    return accum;
  }, `UPDATE products SET `);

  result += ` WHERE products.id = ? RETURNING *`;
  return result;
}