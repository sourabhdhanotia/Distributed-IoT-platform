var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var query = require('querystring');

/*
function authenticateUser(){
	//Prepare the JSON to be sent 
	var dataToSend = {appName:'App1', password:'password'};
	var postDataToSend = require('querystring').stringify(dataToSend);

	var options = {
	        host: '10.42.0.82',
	        port: 3000,
	        path: '/login',
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/x-www-form-urlencoded',
	            'Content-Length': postDataToSend.length
	        }
	    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

	
	//Finally post the data
	req.write(postDataToSend)
	req.end()

}
*/

/*----------------------------------------------------------------*/
function mapUserRequest(){
	var jsonFromUser={ userName:'Loki', userPassword:'password', callBackFunction:'GetTemperature'}
}

/*----------------------------------------------------------------*/
// function registerCallback(){

	
// }

/* 1.Authenticate if the user is valid by checking with local MongoDB */

/* 2.Map the user request to a call back function */

/* 3.Prepare the JSON to be sent to the logic server, which will have 
a callback function */

/* 4.Filter server will give a JSON as & when condition satisfied.
So return that in required format to the user 
*/
router.post('/', function(req, res) {
	
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
            sensorIds : [246, 783, 394]
        },
        interval : 5000,
        callbackOnInterval : false,
        pushURL : {
            host : '10.1.130.53',   	//Filter Server IP
            port : 3000,
            path : '/hitMe'
        },//Your post interval you want to register with filter server
        accessKey : 'be713f80fb0b5635b9452cb3646c5fbd8ddd443f92734d73b1f4b0f390031aec5c1b0c6001e8cdd653b5ffbae34b26f0',
        /*callbackFunction : "function getSensorDataByID(id){for(var i = 0; i < sensors.length; i++){if(sensors[i].data.sensorId == id){return sensors[i].data.sensorData;}}}if(getSensorDataById(246).value < 100){console.log('Sending callback...');return true;}else{return false;}",*/
        callbackFunction : funDef,
        requestId : 'sourabh'
    });
    
    console.log(dataToSend)

	var options = {
	  host: '10.1.130.145',
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

	res.json({
		"status" : "Registered Callback successfully."
	})
} );

module.exports = router;    
