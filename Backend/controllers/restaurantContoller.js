const db = require("../db");

const getTopRestaurants = (request, response, next) => {
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants order by rating desc limit 6",
    [],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getAllRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants  OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getBreakfastRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants where start_time < '12:00:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getLunchRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants where close_time >= '15:00' and start_time <='12:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getDinnerRestaurants = (request, response, next) => {
  const pageNo = request.params.pageno;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants where close_time > '18:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
    [pageNo],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getCityRestaurants = (request, response, next) => {
  let { cityString } = request.params;
  db.query(
    "SELECT id, name from restaurants where city=$1 order by name ",
    [cityString],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const searchRestaurant = (request, response, next) => {
  let { cityString, searchString } = request.params;
  db.query(
    "SELECT id, name from restaurants where city=$1 and name ilike $2 order by name ",
    [cityString, "%" + searchString + "%"],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getRestaurant = (request, response, next) => {
  const { restaurantId } = request.params;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating, phone, address1, latitude, longitude, address2 FROM restaurants where id = $1",
    [restaurantId],
    (err, res) => {
      if (err) {
        response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getCities = (request, response, next) => {
  db.query("SELECT distinct city from restaurants", [], (err, res) => {
    if (err) {
      response.status(400).json(err);
    }
    response.send(res?.rows);
  });
};

const getReviews = (request, response, next) => {
  console.log(request.params);
  const { restaurantId, pageno } = request.params;
  db.query(
    "Select reviews.rating, review, users.name, users.profile_img, reviewed_at from reviews inner join users on reviews.user_id = users.id where reviews.restaurant_id = $1 order by reviews.id desc OFFSET ($2 * 2) ROWS  FETCH FIRST 2 ROW ONLY",
    [restaurantId, pageno],
    (err, res) => {
      if (err) {
        response.status(400).json(err);
      }
      response.send(res?.rows);
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

const postSearches = (request, response) => {
  const userId = request.user.id;
  const { restaurantId} = request.body;
  db.query(
    "Select id from searches where restaurant_id = $1 and searched_by = $2",
    [restaurantId, userId],
    (err, res) => {
      if (err) {
        response.status(400).json(err);
      }
      console.log(res.rows);
      if (res?.rows.length > 0) {
        db.query(
          "UPDATE searches set restaurant_id=$1 where restaurant_id = $1 and searched_by=$2 ",
          [restaurantId, userId],
          (err, res) => {
            if (err) {
              return response.status(400).json(err);
            }
            response.status(201).json("Recent searches updated");
          }
        );
      } else {
        db.query(
          "INSERT into searches (restaurant_id, searched_by) values ($1, $2)",
          [restaurantId, userId],
          (err, res) => {
            if (err) {
              return response.status(400).json(err);
            }
            db.query(
              "Select id from searches where searched_by = $1",
              [userId],
              (err, res) => {
                if (err) {
                  return response.status(400).json(err);
                }
                if (res?.rows.length > 4){
                  db.query(
                    "Delete from searches where id= (select id from searches where searched_by = $1 order by searched_at limit 1 )",
                    [userId],
                    (err, res) => {
                      if (err) {
                        return response.status(400).json(err);
                      }
                      return response.status(201).json("Recent searches posted");
                      
                    }
                  );
                }

              }
            );
            return response.status(201).json("Recent searches posted");
          }
        );
      }
    }
  );
};

const getRecentSearches = (request, response, next) => {
  const userId = request.user.id;
  db.query(
    "Select restaurants.id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants inner join searches on restaurants.id = searches.restaurant_id where searches.searched_by = $1 order by searches.searched_at desc",
    [userId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getPhotos = (request, response) => {
  const {restaurantId} = request.params
  db.query(
    "Select url from photos where restaurant_id = $1", [restaurantId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  )
}

module.exports = {
  getTopRestaurants,
  getAllRestaurants,
  getLunchRestaurants,
  getBreakfastRestaurants,
  getDinnerRestaurants,
  getRestaurant,
  getReviews,
  postReview,
  searchRestaurant,
  getCities,
  getCityRestaurants,
  postSearches,
  getRecentSearches,
  getPhotos
};
