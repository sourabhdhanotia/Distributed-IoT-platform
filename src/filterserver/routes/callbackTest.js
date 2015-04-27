/**
 * Created by veerendra on 10/4/15.
 */
var express = require('express');
var router = express.Router();

/* POST home page. */
router.post('/', function(req, res, next) {
    var request = require('request');
    var dataToSend = {
        data : {
            sensorIds : [2642,9119]
        },
        interval : 5000,
        callbackOnInterval : true,
        pushURL : {
            host : '10.3.0.138',   	//Filter Server IP
            port : 3000,
            path : '/hitMe'
        },//Your post interval you want to register with filter server
        accessKey : '5982a3a6f2c51e2211042e1254a9ceca1c42d253a1efd689689dfb5b8e1e50b98e72b2d6d3446023ba3c4baa8deab1bb',
        callbackFunction : 'function getSensorDataByID(id){for(var i = 0; i < sensors.length; i++){if(sensors[i].data.sensorId == id){return sensors[i].data.sensorData;}}}if(getSensorDataByID(2642).value > 35){console.log("Sending callback...");return true;}else{return false;}',
        requestId : 56
    };

    request.post(
        'http://localhost:3000/callback',
        {json : dataToSend },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body)
                console.log("Successfully compl")
            }
        }
    );
    res.json({status:"complete"});
});

module.exports = router;
