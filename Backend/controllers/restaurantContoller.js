const db = require('../db')

const getTopRestaurants = (request,response,next)=> {
    db.query('Select name, location, cuisine, price, start_time, close_time, rating  FROM restaurants order by rating desc limit 6', [], (err, res)=>{
        if(err){
            return next(err)
        }
        response.send(res.rows)
    })
}

const getAllRestaurants = (request,response,next)=> {
    db.query('Select name, location, cuisine, price, start_time, close_time, rating  FROM restaurants', [], (err, res)=>{
        if(err){
            return next(err)
        }
        response.send(res.rows)
    })
}

module.exports = {
    getTopRestaurants,
    getAllRestaurants
}