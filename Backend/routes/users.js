var express = require("express");
var router = express.Router();
const db = require("../db");

/* GET users listing. */
router.route("/").post((request, response, next) => {
  const { name, email, phone, password, confirmPassword } = request.body;
  db.query('SELECT * FROM USERS WHERE email=$1', [email], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length > 0) {
      response.status(403).send("Email already registered");
    } else {
      db.query(
        "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4)",
        [name, email, phone, password],
        (err, res) => {
          if (err) {
            return next(err);
          }
          response.status(201).json({ message: "User successfuly created" });
        }
      );
    }
  });
});

module.exports = router;
