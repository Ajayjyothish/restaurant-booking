const db = require("../db");

const getTopRestaurants = (request, response, next) => {
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants order by rating desc limit 6",
    [],
    (err, res) => {
      if (err) {
        return next(err);
      }
      response.send(res.rows);
    }
  );
};

const getAllRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants  OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return next(err);
      }
      response.send(res.rows);
    }
  );
};

const getBreakfastRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants where start_time < '12:00:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return next(err);
      }
      response.send(res.rows);
    }
  );
};

const getLunchRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants where close_time >= '15:00' and start_time <='12:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return next(err);
      }
      response.send(res.rows);
    }
  );
};


const getDinnerRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants where close_time > '18:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return next(err);
      }
      response.send(res.rows);
    }
  );
};


const getRestaurant = (request, response, next) => {
  const { restaurantId } = request.params;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating, phone, address1, address2 FROM restaurants where id = $1",
    [restaurantId],
    (err, res) => {
      if (err) {
        next(err);
      }
      response.send(res.rows);
    }
  );
};

const getReviews = (request, response, next) => {
  console.log(request.params);
  const { restaurantId, pageno } = request.params;
  db.query(
    "Select reviews.rating, review, users.name, users.profile_img, reviewed_at from reviews inner join users on reviews.user_id = users.id where reviews.restaurant_id = $1 order by reviews.id desc OFFSET ($2 * 2) ROWS  FETCH FIRST 2 ROW ONLY",
    [restaurantId, pageno],
    (err, res) => {
      if (err) {
        next(err);
      }
      response.send(res.rows);
    }
  );
};

const postReview = (request, response, next) => {
  const userId = request.user.id;
  const { rating, review, restaurantId } = request.body;
  db.query(
    "INSERT INTO reviews(rating, review, restaurant_id, user_id) VALUES ($1, $2, $3, $4)",
    [rating, review, restaurantId, userId],
    (err, res) => {
      if (err) return err;
      response.status(201).json("Review has been posted");
    }
  );
};

module.exports = {
  getTopRestaurants,
  getAllRestaurants,
  getLunchRestaurants,
  getBreakfastRestaurants,
  getDinnerRestaurants,
  getRestaurant,
  getReviews,
  postReview,
};
