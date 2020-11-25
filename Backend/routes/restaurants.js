var express = require('express');
var router = express.Router();
const restaurantContoller = require('../controllers/restaurantContoller')

/* GET users listing. */
router.get("/top-restaurants", restaurantContoller.getTopRestaurants)

router.get("/", restaurantContoller.getAllRestaurants)


module.exports = router;
