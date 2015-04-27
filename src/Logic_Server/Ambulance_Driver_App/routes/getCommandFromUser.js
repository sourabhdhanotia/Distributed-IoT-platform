var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var query = require('querystring');

var router = express.Router();

/* Input JSON
 * { 
 * 		accessKey : "sourabh",
 * 		sensorFamilyId : 11
 * }
 */
 
router.post('/', function(req, res, next) {
	console.log("Command from user : ");
	console.log(req.body );
	console.log(req.body.sensorFamilyId );
	
	var aaa= req.body.sensorFamilyId;
	var x_lat = req.body.lat;
	var x_lon = req.body.lon;
	
	userAuth.findOne({userName:req.body.accessKey}, function(err, user){
		if( user==null ){
			res.json({
					isAuthenticated:false,
					msg : 'User does not exist'
				});
		}
		else{
	
			console.log("aaa : " + aaa );
			console.log("From DB : " + user );
			pathToHit = "/registry/sensors/location/11"; //+ aaa
			
			var data = {
				"lat" : 2,
				"lon" : 4,
				"range":200,
				"accessKey":"f4b9da70e2bf1715101577d7e85e2547786bc6e654686f08a20b05cf0dde32309c41990f9a26e8521852f10b11f6d167",
			}
			var http = require('http');
			var httpOptions = {
				hostname: registryServerIP,
				port: 3000,
				path: pathToHit,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(JSON.stringify(data))
				}
			};
			
			var req = http.request(httpOptions, function (res) {
				res.on('data', function (chunk) {
					data += chunk;
				});

				res.on('end', function (chunk) {
					var dataObject = JSON.parse(data);
					console.log(dataObject);
				});
			});
			
			req.on('error', function (e) {
				console.error(e);
			});
			
			req.write(data);
			req.end();
					
		}
		
	});
	
	
	
//----------------------------------------------------------------------------


	
});

module.exports = router;

