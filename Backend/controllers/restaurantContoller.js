const db = require("../db");

const getTopRestaurants = (request, response, next) => {
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants order by rating desc limit 4",
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
    "Select id, name, location, cuisine, price, start_time, close_time, latitude, longitude, rating  FROM restaurants  OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
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
    "Select id, name, location, cuisine, price, start_time, close_time, rating, latitude, longitude  FROM restaurants where start_time < '12:00:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
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
    "Select id, name, location, cuisine, price, start_time, close_time, rating, latitude, longitude  FROM restaurants where close_time >= '15:00' and start_time <='12:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
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
    "Select id, name, location, cuisine, price, start_time, close_time, rating, latitude, longitude  FROM restaurants where close_time > '18:00' OFFSET ($1 * 4) ROWS  FETCH FIRST 4 ROW ONLY; ",
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
  let { cityString, pageNo } = request.params;
  db.query(
    "SELECT id, name, location, cuisine, price, start_time, close_time, rating, phone, address1, latitude, longitude, address2 from restaurants where city=$1 order by name OFFSET ($2 * 4) ROWS  FETCH FIRST 4 ROW ONLY ",
    [cityString, pageNo],
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

const searchKeyword = (request, response) => {
  let { cityString, searchString, pageNo } = request.params;
  db.query(
    "SELECT id, name, location, cuisine, price, start_time, close_time, rating, phone, address1, latitude, longitude, address2 from restaurants where (name ilike $2 or cuisine ilike $2) and city=$1 OFFSET ($3 * 4) ROWS  FETCH FIRST 4 ROW ONLY",
    [cityString, "%" + searchString + "%", pageNo],
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
    "Select id, name, location, cuisine, price, start_time, close_time, rating, phone, address1, latitude, longitude, address2, pin, city, state FROM restaurants where id = $1",
    [restaurantId],
    (err, res) => {
      if (err) {
        response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getIsFavorite = (request, response) => {
  const userId = request.user.id;
  const { restaurantId } = request.params;
  db.query(
    "Select id from favorites where restaurant_id = $1 and favorited_by = $2",
    [restaurantId, userId],
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
  const { restaurantId } = request.body;
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
                if (res?.rows.length > 4) {
                  db.query(
                    "Delete from searches where id= (select id from searches where searched_by = $1 order by searched_at limit 1 )",
                    [userId],
                    (err, res) => {
                      if (err) {
                        return response.status(400).json(err);
                      }
                      return response
                        .status(201)
                        .json("Recent searches posted");
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
  const { restaurantId } = request.params;
  db.query(
    "Select url,id from photos where restaurant_id = $1",
    [restaurantId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const getMenus = (request, response) => {
  const { restaurantId } = request.params;
  db.query(
    "Select url,id from menus where restaurant_id = $1",
    [restaurantId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const deletePhoto = (request, response) =>{
  const id = request.params.id
  db.query(
    "Delete from photos where id = $1",
    [id],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.json("Photo has been deleted");
    }
  )
}

const deleteMenu = (request, response) =>{
  const id = request.params.id
  db.query(
    "Delete from menus where id = $1",
    [id],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.json("Menu has been deleted");
    }
  )
}

const getFavouriteRestaurants = (request, response) => {
  const pageNo = request.params.pageNo;
  const userId = request.user.id;
  db.query(
    "Select restaurants.id, name, location, cuisine, price, start_time, close_time, rating  FROM restaurants inner join favorites on restaurants.id = favorites.restaurant_id where favorites.favorited_by = $1 OFFSET ($2 * 4) ROWS  FETCH FIRST 4 ROW ONLY",
    [userId, pageNo],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const deleteUserRestaurant = (request, response) => {
  const userId = request.user.id;
  const restaurantId = request.params.restaurantId;
  db.query(
    "Delete from restaurants where id=$1 and user_id = $2",
    [restaurantId, userId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.json("Restaurant deleted");
    }
  );
};

const postFavorite = (request, response) => {
  const userId = request.user.id;
  const { restaurantId } = request.body;
  db.query(
    "INSERT into favorites (restaurant_id, favorited_by) values ($1, $2)",
    [restaurantId, userId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.status(201).json("Favorited");
    }
  );
};

const deleteFavorite = (request, response) => {
  const userId = request.user.id;
  const { restaurantId } = request.params;
  db.query(
    "DELETE from favorites where restaurant_id = $1 and favorited_by= $2",
    [restaurantId, userId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      return response.status(201).json("Deleted");
    }
  );
};

const getUserRestaurants = (request, response) => {
  const pageNo = request.params.pageNo;
  const userId = request.user.id;
  db.query(
    "Select id, name, location, cuisine, price, start_time, close_time, rating from restaurants where user_id = $1 OFFSET ($2 * 4) ROWS  FETCH FIRST 4 ROW ONLY",
    [userId, pageNo],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const postRestaurant = (request, response) => {
  const userId = request.user.id;
  const {
    name,
    location,
    startTime,
    closeTime,
    cuisine,
    price,
    phone,
    address1,
    address2,
    rating,
    city,
    state,
    pin,
    lat,
    lng,
  } = request.body;
  db.query(
    "Insert into restaurants (name,location,start_Time,close_Time,user_id,cuisine,price,phone,address1,address2,rating,city,state,pin,latitude,longitude) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) returning id",
    [
      name,
      location,
      startTime,
      closeTime,
      userId,
      cuisine,
      price,
      phone,
      address1,
      address2,
      rating,
      city,
      state,
      pin,
      lat,
      lng,
    ],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const updateRestaurant = (request, response) => {
  const userId = request.user.id;
  const {
    id,
    name,
    location,
    start_time,
    close_time,
    cuisine,
    price,
    phone,
    address1,
    address2,
    rating,
    city,
    state,
    pin,
    latitude,
    longitude,
  } = request.body;
  db.query(
    "Update restaurants set name=$1,location=$2,start_Time=$3,close_Time=$4,user_id=$5,cuisine=$6,price=$7,phone=$8,address1=$9,address2=$10,rating=$11,city=$12,state=$13,pin=$14,latitude=$15,longitude=$16 where id=$17",
    [
      name,
      location,
      start_time,
      close_time,
      userId,
      cuisine,
      price,
      phone,
      address1,
      address2,
      rating,
      city,
      state,
      pin,
      latitude,
      longitude,
      id
    ],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.send(res?.rows);
    }
  );
};

const postPhotos = (request, response) => {
  const userId = request.user.id;
  const { restaurantId, url } = request.body;
  db.query(
    "Insert into photos (url, restaurant_id) values ($1, $2)",
    [url, restaurantId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.json("Photos' urls added to db");
    }
  );
};

const postMenus = (request, response) => {
  const userId = request.user.id;
  const { restaurantId, url } = request.body;
  db.query(
    "Insert into menus (url, restaurant_id) values ($1, $2)",
    [url, restaurantId],
    (err, res) => {
      if (err) {
        return response.status(400).json(err);
      }
      response.json("Menus' urls added to db");
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
  searchRestaurant,
  getCities,
  getCityRestaurants,
  postSearches,
  getRecentSearches,
  getPhotos,
  searchKeyword,
  getFavouriteRestaurants,
  getIsFavorite,
  postFavorite,
  deleteFavorite,
  getUserRestaurants,
  deleteUserRestaurant,
  postRestaurant,
  postPhotos,
  updateRestaurant,
  deletePhoto,
  postMenus,
  getMenus,
  deleteMenu
};
