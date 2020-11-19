const { Pool } = require("pg");
const pool = new Pool({
  user: "ajayjyothish",
  host: "localhost",
  database: "restaurantdb",
  password: "postgres",
  port: 5432,
});

module.exports = {
  query: (text, params, callback) => {
    const start = Date.now();
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start;
      if (res != undefined) {
        console.log("executed query", { text, duration, rows: res.rowCount });
      }
      callback(err, res);
    });
  },
};
