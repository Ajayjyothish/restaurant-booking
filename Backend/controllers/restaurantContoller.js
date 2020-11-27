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
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants",
    [],
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
  const { restaurantId } = request.params;
  db.query(
    "Select reviews.rating, review, users.name, (reviewed_at + interval '1 day') as reviewed_at from reviews inner join users on reviews.user_id = users.id where reviews.restaurant_id = $1",
    [restaurantId],
    (err, res) => {
      if (err) {
        next(err);
      }
      response.send(res.rows);
    }
  );
};

module.exports = {
  getTopRestaurants,
  getAllRestaurants,
  getRestaurant,
  getReviews,
};
