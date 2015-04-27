var express = require('express');
var router = express.Router();
var http = require('http');
var util = require('util');
var query = require('querystring');

var router = express.Router();


function getDataFromRegistryBasedLocation(lat, lon, range, accessKey){
	
	var options = {
	        host: '10.3.1.131',
	        port: 3000,
	        path:'/registry/sensors/location?lat='+lat+'&lon='+lon+'&range='+range+'&accessKey='+accessKey,
	        method: 'GET',
	        
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
	//req.write(postDataToSend)
	req.end()

}


/* Dummy GET */
router.get('/', function(req, res, next) {

	var lat=2
	var lon=3
	var range=200
	var accessKey=123
	
	getDataFromRegistryBasedLocation(lat, lon, range, accessKey);
    res.json({'status':1, 'comments': 'Testing GET hit'});

});


module.exports = router;