const express = require(`express`);
const router = express.Router();
const knex = require('../knex/knex.js');
module.exports = router;

router.post(`/login`, (req, res) => {
  knex.raw(`select * from users where users.email = ?`, [req.body.email])
  .then((result) => {
    if (result.rows.length) {
      if (result.rows[0].password === req.body.password) {
        return res.json(result.rows[0]);
      } else {
        return res.json({ message: `Incorrect password` });
      }
    }
    return res.json({ message: `User not found` });
  });
})
.post(`/register`, (req, res) => {
  return knex.raw(`SELECT * FROM users WHERE users.email = ?`, [req.body.email])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      throw Error(`User already exists`);
    }
    return foundUser;
  })
  .then((insertUser) => {
    return knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [req.body.email, req.body.password]);
  })
  .then((insertedUser) => {
    return insertedUser.rows[0];
  })
  .then((result) => {
    return res.json(result);
  })
  .catch((err) => {
    return res.json({ message: err.message });
  });
})
.get(`/:user_id`, (req, res) => {
  knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id]).then((result) => {
    if (result.rows.length) {
      return res.json(result.rows[0]);
    } else {
      return res.json({ message: `User not found` });
    }
  });
})
.put(`/:user_id/forgot-password`, (req, res) => {
  knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((foundUser) => {
    if (foundUser.rows.length) {
      return foundUser;
    }
    throw Error(`User not found`);
  })
  .then((updateUser) => {
    return knex.raw(`UPDATE users SET password = ? WHERE users.id = ?`, [req.body.password, req.params.user_id]);
  })
  .then((sendResponse) => {
    return res.json({ message: `New password created!` });
  })
  .catch((err) => {
    return res.json({ message: err.message });
  });
})
.delete(`/:user_id`, (req, res) => {
  knex.raw(`DELETE FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((deletedUser) => {
    if (deletedUser.rowCount) {
      return res.json({ message: `User id: ${req.params.user_id} successfully deleted` });
    } else {
      return res.json({ message: `User ID not found` });
    }
  });
});
