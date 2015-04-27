/**
 * Created by veerendra on 24/3/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.query.startTime == undefined || req.query.endTime == undefined || req.query.accessKey == undefined){
        res.json({'status': 0, 'statusDesc': 'Payload Incorrect','version': 1.0,'timestamp': new Date().getTime(),'comments': null, 'request': req.query, 'data': null})
    }

    if(req.query.id == "1"){
        sensorFamily = "Temperature";
        comments = "Data of all the Temperature sensors";
        unit = "Celsius";
    }else if(req.query.id == "2"){
        sensorFamily = "Humidity";
        comments = "Data of all the Humidity sensors";
        unit = "Water Vapor Content in Percentage";
    }else if(req.query.id == "3"){
        sensorFamily = "GPS";
        comments = "Data of all the GPS sensors";
        unit = "Lat-long"
    }

    sensorData = [{'sensorID': req.query.id*1,'sensorFamily':sensorFamily,'recording': req.query.id*40, 'unitOfMeasure' : unit, 'locationId': 1 },
        {'sensorID': (req.query.id*1)+1, 'sensorFamily':sensorFamily, 'recording': req.query.id*40, 'unitOfMeasure' : unit, 'locationId': 2 }];
    res.json({'status': 1, 'statusDesc':'Success','version': 1.0,'timestamp': new Date().getTime(),'comments': comments, 'request': req.query, 'data':{'sensorData': sensorData}});
});

module.exports = router;
