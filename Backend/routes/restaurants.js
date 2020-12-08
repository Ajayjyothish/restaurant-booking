var express = require('express');
var router = express.Router();
const restaurantContoller = require('../controllers/restaurantContoller')
const auth = require('../controllers/authContoller')


/* GET users listing. */
router.get("/top-restaurants", restaurantContoller.getTopRestaurants)

router.get('/cities', restaurantContoller.getCities),

router.get('/city-restaurants/:cityString', restaurantContoller.getCityRestaurants )

router.post('/recentSearches', restaurantContoller.postSearches)

router.get('/recentSearches/:userId', restaurantContoller.getRecentSearches)

router.get("/category/breakfast/:pageno", restaurantContoller.getBreakfastRestaurants),

router.get("/category/lunch/:pageno", restaurantContoller.getLunchRestaurants),

router.get("/category/dinner/:pageno", restaurantContoller.getDinnerRestaurants),


router.get('/restaurant/:restaurantId', restaurantContoller.getRestaurant)

router.get('/restaurant/:restaurantId/reviews/:pageno', restaurantContoller.getReviews)

router.post('/review', auth , restaurantContoller.postReview )

router.get('/search/:cityString/:searchString', restaurantContoller.searchRestaurant)

router.get('/photos/:restaurantId', restaurantContoller.getPhotos)

router.get("/:pageno", restaurantContoller.getAllRestaurants),


module.exports = router;
