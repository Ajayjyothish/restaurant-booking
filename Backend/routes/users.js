var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require("bcryptjs");
const db = require("../db");

dotenv.config();

/* GET users listing. */
router.post("/signup", (request, response, next) => {
  const { name, email, phone, password, confirmPassword } = request.body;
  db.query("SELECT * FROM USERS WHERE email=$1", [email], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length > 0) {
      response.status(403).send("Email already registered");
    } else {
      bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(password, salt).then((hashPassword) => {
          db.query(
            "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4)",
            [name, email, phone, hashPassword],
            (err, res) => {
              if (err) {
                return next(err);
              }
              response
                .status(201)
                .json({ message: "User successfuly created" });
            }
          );
        });
      });
    }
  });
});

router.post("/signin", (request, response, next) => {
  const { email, password } = request.body;
  db.query("SELECT * FROM USERS WHERE email=$1", [email], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length === 0) {
      response.status(403).send("Email is wrong");
    } else {
      bcrypt
        .compare(password, result.rows[0].password)
        .then((isValidPass) => {
          if (isValidPass) {
            const jwtBearerToken = jwt.sign({}, process.env.TOKEN_SECRET,{
              expiresIn: 3600,
            })
            return response.status(200).json({
              idToken : jwtBearerToken,
              expiresIn: "3600"
            })
          } else return response.status(403).send("Password is wrong");
        })
        .catch((err) => {
          response.send("Some error");
        });
    }
  });
});

module.exports = router;
