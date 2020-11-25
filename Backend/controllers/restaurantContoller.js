const db = require('../db')

const getTopRestaurants = (request,response,next)=> {
    db.query('Select name, location, cuisine, price, time, rating  FROM restaurants order by rating desc limit 6', [], (err, res)=>{
        if(err){
            return next(err)
        }
        response.send(res.rows)
    })
}

module.exports = {
    getTopRestaurants
}