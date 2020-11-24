var express = require("express");
var router = express.Router();
const userController = require('../controllers/userController')


router.post("/signup", userController.user_signup );

router.post("/signin", userController.user_signin);

router.post("/forgotpassword", userController.user_forgotPassword );

router.post("/newpassword", userController.user_newPassword )

module.exports = router;
