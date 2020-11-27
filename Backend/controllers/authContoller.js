const { response } = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (request, respone, next) => {
  if (!request.headers.authorization)
    return respone.status(401).send("Access Denied");
  const token = request.headers.authorization.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    request.user = verified;
    next();
  } catch {
    respone.status(400).send("Invalid Token");
  }
};
