var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var query = require('querystring');

var router = express.Router();

//Mongoose connects to DB
/*
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/logicServer');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userRules = mongoose.model('userrules', new Schema({
    id: ObjectId,
    sensorType1:
    {
        type: String
    },
    operator1:
    {
        type: String
    },
    value1:
    {
        type: Number
    }

},{strict: true}));

*/

/* Expected JSON : 
	{  
	sensorType : ['Humidity', 'Temperature', 'Moisture' ]
	operators : [ '<', '>', '=' ]
	value : [ 30.4, 40.0, 50.6 ]
	
	}
*/

function registerCallbackToFilterServer(){
	listOfSensorIds = [1001, 1101, 1201]
	//listOperators = [">", ">"]
	//listValues = [ 0, 0]
	//filterServerAccessToken="e8d1169c81ad81319797e2d8f9bf5efb94e34f5b994558cb87a52812669b30687722fcfb9b29a20c9a74eaa8306ff9b2"
	//globalUsername="sourabh"

	//console.log("\n --- GLOBALS b4 callback are : " )
	//console.log("\n --- logicServerIP: " + logicServerIP + " filterServerIP: " + filterServerIP + " filterServerAccessToken: " + filterServerAccessToken);


	var ifCondition=''
	for(var i=0 ; i<listOperators.length ; i++ ){
			ifCondition = ifCondition + " getSensorDataByID(" + listOfSensorIds[i] + ").value" + 
			listOperators[i].trim() + parseInt(listValues[i])
			
			if( i!=listOperators.length-1 ){
					ifCondition = ifCondition + " && "
			}
		
	}

	console.log("\n if condition "+ifCondition);
	console.log("\n")
	
	var funDef = "function getSensorDataByID(id){for(var i = 0; i < sensors.length; i++){if(sensors[i].data.sensorId == id){return sensors[i].data.sensorData;}}}if(" + ifCondition + "){console.log('Sending callback...');return true;}else{return false;}"
	
	//console.log("\n function def : " + funDef);
	
	var http = require('http');
	var dataToSend = JSON.stringify({
        data : {
            sensorIds : listOfSensorIds //GET them from registry
        },
        interval : 5000,
        callbackOnInterval : false,
        pushURL : {
            host : logicServerIP,   	
            port : 4000,
            path : '/hitMe'
        },//Your post interval you want to register with filter server
        
        accessKey : filterServerAccessToken,
        callbackFunction : funDef,
        
        //callbackFunction : 'if( getSensorDataByID(2).value>23 &&  getSensorDataByID(1).value<45){console.log("Sending callback...");return true;}else{return false;}',
        requestId : globalUsername
    });
    
    //console.log("---[getRulesFromUser.js] Value of funDef : " + funDef)

	var options = {
	  host: filterServerIP,
	  port: 3000,
	  path: '/callback',
	  method: 'POST',
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
		    console.log(result);
		  });
	});

	req.on('error', function(err) {
	  console.log(err);
	});

	req.write(dataToSend);
	req.end();

}




router.post('/', function(req, res, next) {
	console.log("Inside getRulesFromUser")
	console.log(req.body);
	
// 	listSensorTypes = JSON.parse(req.body.sensorType);
 	listOperators = req.body.operators;
 	listValues = req.body.values;
		
		
		/* TODO : Fill listOfSensorIds with registry API call */
		
		
// 	console.log("\n ---[getRulesFromUser.js] : Got Rules from user, now registering call back with filter server \n")

// //----------------------------------------------------------------------------

// 	/* TODO : From listSensorTypes get all sensors from registry */
// 	var http = require('http');
// 	var dataToSend = JSON.stringify({
//         accessKey : 123, //TODO : Login to registry server & get it
//         active : 1
//     })

//     var options = {
//     	host : registryServerIP,
//     	port : 3000,
//     	path : '/registry/sensors/family/temperature', //TODO: Get proper URL
//     	method : 'GET',
//     	headers: {
// 	    'Content-Type': 'application/json',
// 	    'Content-Length': Buffer.byteLength(dataToSend)
// 	  }
//     };

//     var req = http.request(options, function(res) {
// 		  var result = '';

// 		  res.on('data', function(chunk) {
// 		    result += chunk;
// 		  });

// 		  res.on('end', function() {
// 		    console.log("Response from registry : " + result);
// 		    jsonObject = JSON.parse(result);

// 		    //console.log("AccessToken is : " + jsonObject.accessToken);
// 		    //filterServerAccessToken=jsonObject.accessToken;
		    
// 		  });
// 	});

// 	req.on('error', function(err) {
// 	  console.log(err);
// 	});

// 	req.write(dataToSend);
// 	req.end();
	
//----------------------------------------------------------------------------


	/* TODO : Fill listOfSensorIds with registry API call */
	registerCallbackToFilterServer()

	res.json({
		status:"Successfully registered Callback to Filter Server"
	})


});


module.exports = router;
