var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var query = require('querystring');

var router = express.Router();

var sensorsArray = '';

g_SensorArrays = '';

//global.g_jsonResponse;

//Mongoose connects to DB


function testing(a){

	return a*2;
}

function getDataFromRegistryBasedLocation(lat, lon, range, accessKey){
	var sensorsArray = new Array();

	var options = {
	        host: 'localhost',
	        port: 4000,
	        path:'/registry/sensors/location?lat='+lat+'&lon='+lon+'&range='+range+'&accessKey='+accessKey,
	        method: 'GET',
	        
	    };

	var object ;
    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var body='';

        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);

            console.log('Type of chunk : ' + typeof(chunk) );
            body+=chunk;

        });

        res.on('end', function(){

        	
	    	var jsonObject = JSON.parse(body);

	    	//console.log("---------" + jsonObject.request.sensordata)
	    	
	    	for(var i=0 ; i<jsonObject['sensordata'].length ; i++ ){
	    		var bit = jsonObject['sensordata'][i];

	    		if( bit.status == "up" ){
	    			console.log( "Status : " + bit.id + bit.status );
	    			sensorsArray[sensorsArray.length] = bit.id
	    		}
	    	}
	    	
	    	// console.log("## Inside function, sensorsArray : " + sensorsArray.toString() );

	    	g_SensorArrays = sensorsArray.toString();

    	})

    });

    
	
	//Finally post the data
	//req.write(postDataToSend)
	req.end()

	//return object;
}


router.post('/', function(req, res, next) {
	globalUsername=req.body.userName;
	
	console.log(req.body);
	var sendJson = false;

	if( req.body.lat==undefined && req.body.lon==undefined ){
		//console.log("User already registered, lets find in mongo!")

		userAuth.findOne({userName:req.body.userName}, function(err, user){
			if( !user ){
					res.json({
					isAuthenticated:false,
					msg : 'User does not exist'
				})	
			
			}
			else{
				user.status = false;
				user.save();
				//console.log("User found, collecting sensor data for entered location!")

				//var lat= parseInt(req.body.lat)
				//var lon= parseInt(req.body.lon)

				//console.log("lat & lon are " + req.body.lat + "-" + req.body.lon);

				var range=200
				var accessKey=123
				
				//var object = getDataFromRegistryBasedLocation(lat, lon, range, accessKey);
				
				//console.log("----------data : " + object + "\n" + typeof(object))
				


				res.json({
					isAuthenticated:true,
					Moisture : {
						value : 33.45,
						unit : 'Percentage'
					},
					Humidity : {
						value : 70.22,
						unit : 'Percentage'
					},
					accessKey : globalUsername
				})

				sendJson=false;
			}

		})


	}
	else{
		console.log("inside else")
		console.log(req.body.userName + req.body.password)
		aaa=req.body.userName;
		bbb=req.body.password;
		ccc=req.body.lat;
		ddd=req.body.lon;

		//register new user if doesn't exist
		userAuth.findOne({userName:req.body.userName}, function(err, user){
			if( !user ){
				var newUser = new userAuth({
					userName:aaa,
					password : bbb,
					lat : ccc,
					lon : ddd,
					status:false
				});

				newUser.save(function(err, data) {
					if(err) console.log(err);

					else console.log('Saved' + data);
				})

	//			globalUsername=req.body.userName;
		
			}

		});

		sendJson=true
	//fetch the basic data to be shown & send it to user.

		/*
		var lat= parseInt(req.body.lat)
		var lon= parseInt(req.body.lon)

		console.log("lat & lon are " + req.body.lat + "-" + req.body.lon);

		var range=200
		var accessKey=123
		
		var sensorsArray = getDataFromRegistryBasedLocation(lat, lon, range, accessKey);
			
		var aa=testing(23);

		console.log("****" + aa);
		console.log("-----" + g_SensorArrays);
		*/
//-----------------------------------------------------------------------------
		var lat= parseInt(req.body.lat)
		var lon= parseInt(req.body.lon)
		var range=20
		//var accessKey=123

/*
	var options = {
	        host: 'localhost',
	        port: 4000,
	        path:'/registry/sensors/location?lat='+lat+'&lon='+lon+'&range='+range+'&accessKey='+accessKey,
	        method: 'GET',
	        
	    };

	var object ;
    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        var body='';

        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);

            console.log('Type of chunk : ' + typeof(chunk) );
            body+=chunk;

        });

        res.on('end', function(){

        	
	    	var jsonObject = JSON.parse(body);

	    	//console.log("---------" + jsonObject.request.sensordata)
	    	
	    	for(var i=0 ; i<jsonObject['sensordata'].length ; i++ ){
	    		var bit = jsonObject['sensordata'][i];

	    		if( bit.status == "up" ){
	    			console.log( "Status : " + bit.id + bit.status );
	    			sensorsArray[sensorsArray.length] = bit.id
	    		}
	    	}
	    	
	    	
    	})

    });

    
	
	//Finally post the data
	//req.write(postDataToSend)
	req.end()


*/
//-----------------------------------------------------------------------------

	// console.log("## Before sending JSON - sensorsArray : " + sensorsArray.toString() );

		if(sendJson){
			res.json({
				isAuthenticated:true,
				Temperature : {
					value : 33.22,
					unit : 'Celsius'
				},
				Humidity : {
					value : 56.45,
					unit : 'Percentage'
				},
				
				accessKey : globalUsername
			});
		}
	
	}	
	
	console.log("\n ---[authenticateUser.js] Global Username set to : " + globalUsername)

	//Get AccessToken from filter Server
	var http = require('http');
	var dataToSend = JSON.stringify({
        appName : "App1",
        password : "password"
    })

    var options = {
    	host : filterServerIP,
    	port : 3000,
    	path : '/login',
    	method : 'POST',
    	headers: {
	    'Content-Type': 'application/json',
	    'Content-Length': Buffer.byteLength(dataToSend)
	  }
    };

    var req = http.request(options, function(res) {
		  var result = '';

		  res.on('data', function(chunk) {
		    result += chunk;
		  });

		  res.on('end', function() {
		    console.log("Response from /login : " + result);
		    jsonObject = JSON.parse(result);

		    console.log("AccessToken is : " + jsonObject.accessToken);
		    filterServerAccessToken=jsonObject.accessToken;
		    
		  });
	});

	req.on('error', function(err) {
	  console.log(err);
	});

	req.write(dataToSend);
	req.end();

    

	listOfSensorIds = ["246", "783", "394" ]
	//Temp + Humidity + Moisture
	    
});


module.exports = router;
