var express = require('express');
var router = express.Router();
const restaurantContoller = require('../controllers/restaurantContoller')
const auth = require('../controllers/authContoller')



router.get("/top-restaurants", restaurantContoller.getTopRestaurants)

router.post('/new-restaurant', auth, restaurantContoller.postRestaurant)

router.post('/new-restaurant/photos', auth, restaurantContoller.postPhotos)

router.post('/new-restaurant/menus', auth, restaurantContoller.postMenus)

router.post('/edit-restaurant', auth, restaurantContoller.updateRestaurant)

router.get('/cities', restaurantContoller.getCities),

router.get('/city-restaurants/:cityString/:pageNo', restaurantContoller.getCityRestaurants )

router.post('/recentSearches', auth, restaurantContoller.postSearches)

router.get('/recentSearches', auth, restaurantContoller.getRecentSearches)

router.get("/category/breakfast/:pageno", restaurantContoller.getBreakfastRestaurants),

router.get("/category/lunch/:pageno", restaurantContoller.getLunchRestaurants),

router.get("/category/dinner/:pageno", restaurantContoller.getDinnerRestaurants),

router.post('/restaurant/favorite', auth, restaurantContoller.postFavorite )

router.get('/restaurant/:restaurantId', restaurantContoller.getRestaurant)

router.delete('/restaurant/:restaurantId', auth,  restaurantContoller.deleteUserRestaurant)

router.get('/restaurant/:restaurantId/reviews/:pageno', restaurantContoller.getReviews)

router.get('/restaurant/:restaurantId/favorite', auth, restaurantContoller.getIsFavorite)

router.delete('/restaurant/:restaurantId/favorite', auth, restaurantContoller.deleteFavorite)


router.post('/review', auth , restaurantContoller.postReview )

router.get('/search/:cityString/:searchString', restaurantContoller.searchRestaurant)



router.get('/photos/:restaurantId', restaurantContoller.getPhotos)

router.get('/menus/:restaurantId', restaurantContoller.getMenus)

router.delete('/photos/:id', auth, restaurantContoller.deletePhoto)

router.delete('/menus/:id', auth, restaurantContoller.deleteMenu)

router.get('/favorites/:pageNo', auth,  restaurantContoller.getFavouriteRestaurants)

router.get('/userRestaurants/:pageNo', auth, restaurantContoller.getUserRestaurants)

router.get('/:cityString/:searchString/:pageNo', restaurantContoller.searchKeyword)


router.get("/:pageno", restaurantContoller.getAllRestaurants),


module.exports = router;
