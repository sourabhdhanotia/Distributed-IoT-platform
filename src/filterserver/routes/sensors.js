/**
 * Created by veerendra on 15/4/15.
 */
var express = require('express');
var router = express.Router();

router.get('/:id',function(req, res, next) {
    var sensor_id=req.params.id;
    var comment="Data of Sensor ID "+sensor_id;
    SensorData.findOne(function(err, application) {
        if ( !application ) {
            res.json({'status': 2, 'comments': 'No such Sensor Id or no info available.', 'accessToken': null});
        } else {
            var result={
                "version": "1.0",
                "timestamp": new Date(),
                "comments": comment,
                "request": {
                    "sensorId":sensor_id
                },
                "data":application.data
            };
            res.json({'result':result});
        }
    }).where('data.sensorId').equals(parseInt(sensor_id)).sort('-updatedAt');
});

router.post('/',function(req, res, next) {
    console.log('-----------------------------------------------------------------------------');
    if(req.body.ids == undefined){
        res.json({'status': 0, 'statusDesc': 'Payload Incorrect','version': 1.0,'timestamp': new Date().getTime(), 'request': req.body })
    }else{
        var sensorIds = req.body.ids;
        var result = {
            "version": "1.0",
            "timestamp": new Date(),
            "comments": "Data of all the sensors requested.",
            "request": req.body,
            "data":[]
        };

        function getData(index){
            if(index < sensorIds.length){
                SensorData.findOne({'data.sensorId' : parseInt(sensorIds[index])}).sort({updatedAt: -1}).exec(function(err, sensors) {
                    if ( sensors ) 
                        result.data[index] = sensors.data;
                    else 
                        result.data[index] = null;
                    getData(index+1);
                });
            }else{
                console.log('\nData sent for sensor Ids : ['.yellow+sensorIds.toString().yellow+']'.yellow+'\n');
                res.json(result);
            }
        }
        getData(0);
    }
});

module.exports = router;

