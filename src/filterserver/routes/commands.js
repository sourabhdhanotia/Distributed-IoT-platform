var express = require('express');
var router = express.Router();

router.post('/:id', function(req, res, next) {
    var gatewayId;
    console.log('-----------------------------------------------------------------------------');
    SensorData.findOne({'data.sensorId' : parseInt(req.params.id)}).sort({updatedAt: -1}).exec(function(err, application) {
        if (application) {
            commandList[commandList.length] = {'sensorId': parseInt(req.params.id), 'gatewayId':  parseInt(application.originGatewayId), 'command': req.body.command};
            console.log('\nCommand received: '.green+req.body.command.toString().green+'\n');
            res.json(commandList[commandList.length-1]);
            
        } else {
            console.log("\nInvalid sensor id\n".red);
            res.json({"sensorId": req.params.id, "gatewayId": null, 'command': req.body.command});
        }
    });
});

router.get('/:id', function(req, res, next) {
    var gatewayId;
    SensorData.findOne({'data.sensorId' : parseInt(req.params.id)}).sort({updatedAt: -1}).exec(function(err, application) {
        if (application) {
            commandList[commandList.length] = {'sensorId': req.params.id, 'gatewayId':  application.originGatewayId, 'command': req.body.command};
            res.json(commandList[commandList.length-1]);
        } else {
            res.json({"sensorId": req.params.id, "gatewayId": null, 'command': req.body.command});
        }
    });
});

module.exports = router;

