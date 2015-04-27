var express = require('express');
var router = express.Router();

router.get('/:pname', function(req, res, next) {

    if (req.query.accessKey == undefined) {
        res.json({
            'status': 0,
            'statusDesc': 'Payload Incorrect',
            'version': 1.0,
            'timestamp': new Date().getTime(),
            'comments': null,
            'request': req.query,
            'data': null
        })
    }
    else{

       //Added By Aditi Jain For Security.
      Auth.findOne({token: req.query.accessKey}, function(err, application) {
          if (!(application && (new Date().getTime() - application.lastLoggedIn.getTime() <= 2 * 60 * 60 * 1000))) {
              res.json({
                  'status': 2, 
                  'statusDesc': 'Authentication failure. Please check if accessKey is expired!!',
                  'version': 1.0,
                  'timestamp': new Date().getTime(), 
                  'request': req.query 
              }); 
          }
          else{
            var fs = require('fs');
            var obj;
            var lines = [];
            fs.readFile('repository.json', 'utf8', function (err, data) {
                if (err) throw err;
                obj = JSON.parse(data);
              var item = obj.gateways;
              item.forEach(function(gateway){ 
                  var sensor = gateway.list_of_sensors;
              sensor.forEach(function(snsr){
                console.log(req.param("pname"));
                if(snsr.protocol == req.param("pname")){
                console.log("Sensor:"+snsr.id)
                lines.push(snsr.id);
                }
            })
              
            })
                res.json(
                  {'status': 1, 
                  'statusDesc':'Success',
                  'version': 1.0,
                  'timestamp': new Date ().getTime (),
                  'data':{'sensorData': lines}
                });
            });
          }
      });

    }

//--------------File Read(PC)-------------------
  
//-------------------------------------------------
});

module.exports = router;
