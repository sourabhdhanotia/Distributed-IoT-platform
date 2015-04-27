var express = require('express');
var router = express.Router();
var http = require('http');
var callbackData = "asd";

function VerifySensorByID(id){
    for(var i = 0; i < sensors.length; i++){
        if(sensors[i].data.sensorId == id){
            return sensors[i].data.sensorData;
        }
    }
}

function executeCallback() {
    //console.log(callbackData);
    SensorData.find({'data.sensorId' : {$in : callbackData.data.sensorIds}}).sort({updatedAt: -1}).exec(function(err, sensors) {//[2642,9119]
        var rules = Function('sensors',callbackData.callbackFunction);
        if(rules(sensors)){
            console.log("Rule Satisfied");
            var data = JSON.stringify({
                status: 1,
                statusDesc: 'Callback triggered',
                requestId: callbackData.requestId
            });

            if (callbackData.callbackOnInterval == 'true' || callbackData.callbackOnInterval == true || callbackData.callbackOnInterval == 1) {
                setTimeout(executeCallback, callbackData.interval);
            }

            var options = {
                host: callbackData.pushURL.host,
                port: callbackData.pushURL.port,
                path: callbackData.pushURL.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            };

            var req = http.request(options, function(res) {
                var result = '';

                res.on('data', function(chunk) {
                    result += chunk;
                });

                res.on('end', function() {
                    console.log("Successfully triggered callback");
                    //console.log(result);
                });
            });

            req.on('error', function(err) {
                console.log(err);
            });

            req.write(data);
            req.end();
        }else{
            setTimeout(executeCallback,1000);
        }
    });
    // console.log("Callback over");
}

/* POST home page. */
router.post('/', function(req, res, next) {
    // console.log(req.body);
    if(req.body.data === undefined || req.body.interval === undefined || req.body.callbackOnInterval === undefined || req.body.pushURL === undefined || req.body.accessKey === undefined || req.body.callbackFunction === undefined) {
        res.json({'status': 0, 'statusDesc': 'Payload Incorrect','version': 1.0,'timestamp': new Date().getTime(), 'request': req.body })
    }else {
        SensorData.find({"data.sensorId" : {$in : req.body.data.sensorIds}},function(error, result){
            // console.log(result);
            if(result.length >= req.body.data.sensorIds.length){
                Auth.findOne({token: req.body.accessKey}, function(err, application) {
                    if (application && (new Date().getTime() - application.lastLoggedIn.getTime() <= 5 * 60 * 60 * 1000)) {
                        callbackData = req.body;
                        console.log("Single Callback");
                        executeCallback();
                        res.json({
                            'status': 1,
                            'statusDesc': 'Callback Successfully registered',
                            'version': 1.0,
                            'timestamp': new Date().getTime(),
                            'request': req.body
                        })
                    }else{
                        res.json({'status': 2, 'statusDesc': 'Authentication failure. Please check if accessKey is expired!!','version': 1.0,'timestamp': new Date().getTime(), 'request': req.body });
                    }
                });
            }else{
                res.json({'status': 0, 'statusDesc': 'Incorrect Sensor IDs. Please verify','version': 1.0,'timestamp': new Date().getTime(), 'request': req.body })
            }
        });
    }
});

module.exports = router;
