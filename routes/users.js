const express = require(`express`);
const router = express.Router();
const knex = require('../knex/knex.js');
const doError = require(`../utilities/errorHandler`);
module.exports = router;

router.post(`/login`, (req, res) => {
  knex.raw(`select * from users where users.email = ?`, [req.body.email])
  .then((result) => {
    if (result.rows.length) {
      if (result.rows[0].password === req.body.password) {
        return res.json(result.rows[0]);
      } else {
        return res.status(400).json({ message: `Incorrect password` });
      }
    }
    return res.status(404).json({ message: `User not found` });
  })
  .catch((err) => {
    doError(err, res);
  });
})
.post(`/register`, (req, res) => {
  return knex.raw(`INSERT INTO users (email, password) VALUES (?, ?) RETURNING *`, [req.body.email, req.body.password])
  .then((insertedUser) => {
    return res.json(insertedUser.rows[0]);
  })
  .catch((err) => {
    doError(err, res);
  });
})
.get(`/:user_id`, (req, res) => {
  knex.raw(`SELECT * FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((result) => {
    if (result.rows.length) {
      return res.json(result.rows[0]);
    } else {
      return res.json({ message: `User not found` });
    }
  })
  .catch((err) => {
    doError(err, res);
  });
})
.put(`/:user_id/forgot-password`, (req, res) => {
  return knex.raw(`UPDATE users SET password = ? WHERE users.id = ?`, [req.body.password, req.params.user_id])
  .then((updatedUser) => {
    if (updatedUser.rowCount) {
      return res.json({ message: `New password created!` });
    } else {
      return res.status(404).json({ message: `User was not found` });
    }
  })
  .catch((err) => {
    doError(err, res);
  });
})
.delete(`/:user_id`, (req, res) => {
  knex.raw(`DELETE FROM users WHERE users.id = ?`, [req.params.user_id])
  .then((deletedUser) => {
    if (deletedUser.rowCount) {
      return res.json({ message: `User id: ${req.params.user_id} successfully deleted` });
    } else {
      return res.status(404).json({ message: `User ID not found` });
    }
  })
  .catch((err) => {
    console.log(err);
    doError(err, res);
  });
});
