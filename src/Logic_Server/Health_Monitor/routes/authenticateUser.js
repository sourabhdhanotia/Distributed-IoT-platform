var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var query = require('querystring');

var router = express.Router();

router.post('/', function(req, res, next) {

	



	globalUsername=req.body.userName;
	
	console.log("[authenticateUser.js] Input Request is: \n ");
	console.log(req.body);

//--------------------------------------------------------------------------------

	/* Insert new user & send him accessKey( which is his userName only!) */
	aaa=req.body.userName;
	bbb=req.body.password;
	ccc=req.body.lat;
	ddd=req.body.lon;
	lat=req.body.lat;
	lon=req.body.lon;

	//console.log(aaa + bbb + ccc + ddd )

	if( req.body.lat==undefined && req.body.lon==undefined ){
		/* User already exists, check it! */
	
		//console.log("User already exists, check it!")
		userAuth.findOne({userName:req.body.userName}, function(err, user){
			console.log("user after finding : " + user)
			if( user==null ){
					res.json({
					isAuthenticated:false,
					msg : 'User does not exist'
				});

				sendJson=false;
			}
			else{
				res.json({
					isAuthenticated: true,
					accessKey : aaa,
					lat : user.lat,
					lon : user.lon
				})		
			}

		});

		
	}
	else{
		userAuth.findOne({userName:req.body.userName}, function(err, user){
			console.log("registerilng new user!!")
			if( !user ){
				var newUser = new userAuth({
					userName:aaa,
					password : bbb,
					lat : ccc,
					lon : ddd,
					status:false,
					createdAt: new Date(),
					updatedAt: new Date()
				});

				newUser.save(function(err, data) {
					if(err) console.log(err);

					else console.log('Saved' + data);
				})

				res.json({
					isAuthenticated: true,
					accessKey : aaa
				})

		
			}
			else{
				res.json({
					isAuthenticated: true,
					accessKey : aaa
				})
			}

		});

	}
	


//--------------------------------------------------------------------------------

console.log("\n ------ I can be reached!");


//--------------------------------------------------------------------------------

/* Get all sensors from the registry around the entered lat & lon by user */
/* Parse it & send list of IDs to filterServer */

//--------------------------------------------------------------------------------


});


module.exports = router;
