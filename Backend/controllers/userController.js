const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../db");

dotenv.config();

const user_signup = (request, response, next) => {
  const { name, email, phone, password, confirmPassword } = request.body;
  db.query("SELECT id FROM USERS WHERE email=$1", [email], (err, result) => {
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
};

const user_signin = (request, response, next) => {
  const { email, password } = request.body;
  db.query(
    "SELECT id, password, name, profile_img FROM USERS WHERE email=$1",
    [email],
    (err, result) => {
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
              const jwtBearerToken = jwt.sign(
                { id: result.rows[0].id },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: 3600,
                }
              );
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
    }
  );
};

const social_signup_login = (request, response) => {
  const { name, email, photoUrl } = request.body;
  db.query("SELECT id FROM USERS WHERE email=$1", [email], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length > 0) {
      const jwtBearerToken = jwt.sign(
        { id: result.rows[0].id },
        process.env.TOKEN_SECRET,
        {
          expiresIn: 3600,
        }
      );
      return response.status(200).json({
        idToken: jwtBearerToken,
        expiresIn: "3600",
      });
    } else {
      db.query(
        "INSERT INTO users (name, email, phone, password, profile_img) VALUES ($1, $2, $3, $4, $5) returning id",
        [name, email, "", "", photoUrl],
        (err, res) => {
          if (err) {
            return next(err);
          }
          const jwtBearerToken = jwt.sign(
            { id: res.rows[0].id },
            process.env.TOKEN_SECRET,
            {
              expiresIn: 3600,
            }
          );
          return response.status(200).json({
            idToken: jwtBearerToken,
            expiresIn: "3600",
          });
        }
      );
    }
  });
};

const user_forgotPassword = (request, response, next) => {
  const { email } = request.body;

  db.query(
    "SELECT id FROM USERS WHERE email=$1",
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
        db.query(
          "UPDATE users SET passwordresettoken = $1, resettokenexpiry = $2 WHERE email = $3",
          [resettoken, tokenexpiry, email],
          (err, result) => {
            if (err) {
              return next(err);
            }
          }
        );
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
          return response.status(200).json({
            message:
              "Password reset link has been send to: " +
              nodemailer.getTestMessageUrl(info),
          });
        });
      }
    }
  );
};

const user_newPassword = (request, response, next) => {
  const { resetToken, newPassword } = request.body;
  db.query(
    "SELECT resettokenexpiry FROM USERS WHERE passwordresettoken=$1",
    [resetToken],
    async (err, result) => {
      if (err) {
        return next(err);
      }
      if (result.rows[0].resettokenexpiry < Date.now())
        return response.status(400).send("Token has expired");
      bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(newPassword, salt).then((hashPassword) => {
          db.query(
            "UPDATE users SET passwordresettoken = $1, resettokenexpiry = $2, password=$3 WHERE passwordresettoken = $4",
            ["", null, hashPassword, resetToken],
            (err, result) => {
              if (err) {
                return next(err);
              }
              return response
                .status(200)
                .json({ message: "Password has been changed successfuly" });
            }
          );
        });
      });
    }
  );
};

const user_getProfile = (request, response, next) => {
  const userId = request.user.id;
  db.query(
    "SELECT id, name, profile_img, email, phone from users where id= $1",
    [userId],
    (err, result) => {
      if (err) {
        return response.status(400).json(err);
      }
      return response.send(result.rows);
    }
  );
};

const users_updateProfile = (request, response, next) => {
  const userId = request.user.id;
  const { name, email, phone, password, uploadedImage } = request.body;

  db.query("SELECT id FROM USERS WHERE email=$1", [email], (err, result) => {
    if (err) {
      return next(err);
    }
    if (result.rows.length > 0 && result.rows[0].id !== userId) {
      response.status(403).send("Email already registered");
    } else {
      if (password != "") {
        bcrypt.genSalt(10).then((salt) => {
          bcrypt.hash(password, salt).then((hashPassword) => {
            db.query(
              "UPDATE users SET name = $1, email = $2, phone=$3, password=$4, profile_img=$5 WHERE id=$6",
              [name, email, phone, hashPassword, uploadedImage, userId],
              (err, result) => {
                if (err) {
                  return response.status(400).json(err);
                }
                console.log("Updated with change in password");
                return response.send(result.rows);
              }
            );
          });
        });
      } else {
        db.query(
          "UPDATE users SET name = $1, email = $2, phone=$3, profile_img=$4 where id=$5",
          [name, email, phone, uploadedImage, userId],
          (err, result) => {
            if (err) {
              return response.status(400).json(err);
            }
            console.log("Updated without change in password");
            return response.send(result.rows);
          }
        );
      }
    }
  });
};

const uploadImage = (req, res, next) => {
  const file = req.file;
  console.log(req);
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return res.json(error);
  }
  res.status(200).send({
    statusCode: 200,
    status: "success",
    uploadedFile: file,
  });
};

module.exports = {
  user_signup,
  user_signin,
  user_forgotPassword,
  user_newPassword,
  user_getProfile,
  users_updateProfile,
  uploadImage,
  social_signup_login
};
