/**
 * Created by veerendra on 24/3/15.
 */
var express = require('express');
var router = express.Router();
var http = require('http');


/* GET home page. */
router.get('/', function(request, response, next) {

    var http = require('http');
    var options = {
      host: '10.42.0.1',
      port: 3000,
      path: '/registry/sensors/location/12?lat=2&lon=3&range=200&accessKey=7f64dc379ab1fbcfc817dbdf379f4e04c009dad27fa289b3f5833ab2735c65be7dc4904b40587777fd3c9add3424fb4d'
    };

    var req = http.get(options, function(res) {
      console.log('STATUS: ' + res.statusCode);
      console.log('HEADERS: ' + JSON.stringify(res.headers));

      // Buffer the body entirely for processing as a whole.
      var registryData = "";
      res.on('data', function(chunk) {
        registryData += chunk;
      }).on('end', function() {
        console.log(JSON.parse(registryData));
        response.json(JSON.parse(registryData));
      })
    });

    req.on('error', function(e) {
      console.log('ERROR: ' + e.message);
    });

});

module.exports = router;
