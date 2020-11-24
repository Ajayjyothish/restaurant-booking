var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../db");
const { response } = require("express");

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
            const jwtBearerToken = jwt.sign({}, process.env.TOKEN_SECRET, {
              expiresIn: 3600,
            });
            return response.status(200).json({
              idToken: jwtBearerToken,
              expiresIn: "3600",
            });
          } else return response.status(403).send("Password is wrong");
        })
        .catch((err) => {
          response.send("Some error");
        });
    }
  });
});

router.post("/forgotpassword", (request, response, next) => {
  const { email } = request.body;

  db.query(
    "SELECT * FROM USERS WHERE email=$1",
    [email],
    async (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.rows.length === 0) {
        response.status(403).send("Email does not exist");
      } else {
        const resettoken = crypto.randomBytes(16).toString("hex");
        const tokenexpiry = Date.now() + 3600000;
        db.query('UPDATE users SET passwordresettoken = $1, resettokenexpiry = $2 WHERE email = $3', [resettoken, tokenexpiry, email],(err,result)=>{
          if (err){
            return next(err)
          }
        })
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        var mailOptions = {
          to: email,
          from: "passwordreset@gmail.com",
          subject: "Node.js Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://localhost:4200/response-reset-password/" +
            resettoken +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log("Mail Error: ", err);
          }
          console.log("Info: ", info.messageId);
          console.log("Mail preview URL: ", nodemailer.getTestMessageUrl(info));
          return response.status(200).send("Password reset link has been send to: "+ nodemailer.getTestMessageUrl(info))
        });
      }
    }
  );
});

router.post("/newpassword", (request, response, next)=>{
  const {resetToken, newPassword} = request.body
  db.query(
    "SELECT * FROM USERS WHERE passwordresettoken=$1",
    [resetToken],
    async (err, result) => {
      if (err){
        return next(err)
      }
      if(result.rows[0].resettokenexpiry < Date.now()) return response.status(400).send("Token has expired")
      bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(newPassword, salt).then((hashPassword) => {
          db.query('UPDATE users SET passwordresettoken = $1, resettokenexpiry = $2, password=$3 WHERE passwordresettoken = $4', ["", null, hashPassword , resetToken],(err,result)=>{
            if (err){
              return next(err)
            }
            return response.status(200).send(result)
          })
        })
      })
    })
})

module.exports = router;
