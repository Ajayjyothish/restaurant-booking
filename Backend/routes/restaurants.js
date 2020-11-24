var express = require('express');
var router = express.Router();
const db = require('../db')

/* GET users listing. */
router.route('/')
.get((request,response,next)=> {
    db.query('Select name, location, cuisine, price, time, rating  FROM restaurants', [], (err, res)=>{
        if(err){
            return next(err)
        }
        response.send(res.rows)
    })
})

module.exports = router;
