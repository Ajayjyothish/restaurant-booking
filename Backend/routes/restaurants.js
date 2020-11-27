var express = require('express');
var router = express.Router();
const restaurantContoller = require('../controllers/restaurantContoller')
const auth = require('../controllers/authContoller')


/* GET users listing. */
router.get("/top-restaurants", restaurantContoller.getTopRestaurants)

router.get("/", restaurantContoller.getAllRestaurants),

router.get('/:restaurantId', restaurantContoller.getRestaurant)

router.get('/:restaurantId/reviews', restaurantContoller.getReviews)

router.post('/review', auth , restaurantContoller.postReview )


module.exports = router;
