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
	console.log("\n --- GLOBALS b4 callback are : " )
	console.log("\n --- logicServerIP: " + logicServerIP + " filterServerIP: " + filterServerIP + " filterServerAccessToken: " + filterServerAccessToken);


	var ifCondition=''
	for(var i=0 ; i<listOperators.length ; i++ ){
			ifCondition = ifCondition + " getSensorDataByID(" + listOfSensorIds[i].trim() + ").value" + 
			listOperators[i].trim() + parseInt(listValues[i])
			
			if( i!=listOperators.length-1 ){
					ifCondition = ifCondition + " && "
			}
		
	}

	console.log("\n"+ifCondition);
	console.log("\n")
	
	var funDef = "function getSensorDataByID(id){for(var i = 0; i < sensors.length; i++){if(sensors[i].data.sensorId == id){return sensors[i].data.sensorData;}}}if(" + ifCondition + "){console.log(\"Sending callback...\");return true;}else{return false;}"
	
	console.log(funDef);
	
	var http = require('http');
	var dataToSend = JSON.stringify({
        data : {
            sensorIds : [246]
        },
        interval : 5000,
        callbackOnInterval : false,
        pushURL : {
            host : logicServerIP,   	
            port : 3000,
            path : '/hitMe'
        },//Your post interval you want to register with filter server
        
        /*accessKey : 'be713f80fb0b5635b9452cb3646c5fbd8ddd443f92734d73b1f4b0f390031aec5c1b0c6001e8cdd653b5ffbae34b26f0',*/

        accessKey : filterServerAccessToken,
        /*callbackFunction : "function getSensorDataByID(id){for(var i = 0; i < sensors.length; i++){if(sensors[i].data.sensorId == id){return sensors[i].data.sensorData;}}}if(getSensorDataById(246).value < 100){console.log('Sending callback...');return true;}else{return false;}",*/
        
        callbackFunction : funDef,
        requestId : globalUsername
    });
    
    console.log("---[getRulesFromUser.js] Value of funDef : " + funDef)

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
	console.log("-------------------Inside getRulesFromUser" );	
	console.log(req.body);
	
	console.log("SensorTypes : " + typeof(req.body.sensorType));
	
	console.log("Operators : " + typeof(req.body.operators));
	
	console.log("Values: " + typeof(req.body.values));
	
	listSensorTypes = req.body.sensorType;
	listOperators = req.body.operators;
	listValues = req.body.values;
	
	console.log("Inside getRulesFromUser" + listSensorTypes + listOperators + listValues );
	/*
	var listSensorTypes = JSON.parse(req.body.sensorType)
	var listOperators = JSON.parse(req.body.operators)
	var listValues = JSON.parse(req.body.values)

	for(var i=0 ; i<listSensorTypes.length ; i++ ){
		console.log( listSensorTypes[i] + listOperators[i] + listValues[i]);
	}

	
		var newRule = new userrules({
			sensorType1 : listSensorTypes[i],
			operator1 : listOperators[i],
			value1 : listValues[i]
		});

		newRule.save(function(err, data) {
			if(err) console.log(err);

			else console.log('New Rule inserted in DB ' + data);
		})
	
	*/
	
		
	console.log("\n ---[getRulesFromUser.js] : Got Rules from user, now registering call back with filter server \n")


	registerCallbackToFilterServer()

	res.json({
		status:"Successfully registered Callback to Filter Server"
	})


});


module.exports = router;
