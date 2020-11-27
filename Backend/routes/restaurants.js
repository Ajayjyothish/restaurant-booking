var express = require('express');
var router = express.Router();
const restaurantContoller = require('../controllers/restaurantContoller')

/* GET users listing. */
router.get("/top-restaurants", restaurantContoller.getTopRestaurants)

router.get("/", restaurantContoller.getAllRestaurants),

router.get('/:restaurantId', restaurantContoller.getRestaurant)

router.get('/:restaurantId/reviews', restaurantContoller.getReviews)


module.exports = router;
