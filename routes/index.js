var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var token = req.query.token;
	console.log("Hello World");
	console.log(token);
	//mongo
  	res.render('index', { title: 'Login Page', titleReg: 'Resgistration Page' });
  	 // res.send({"error":"Somethign went wrong"});
});

module.exports = router;
