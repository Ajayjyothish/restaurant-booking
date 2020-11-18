var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/')
.get((req,res,next)=> {
    res.send("Getting all top the restaurants")
})

module.exports = router;
