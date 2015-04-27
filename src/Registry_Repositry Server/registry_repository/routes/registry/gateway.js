//Written by Aditi Jain.

var express = require('express');
var router = express.Router();

router.get('/:gid', function(req, res, next) {

	 if (req.param ("gid") == undefined || req.query.accessKey == undefined) {
	 	console.log("BAD HIT");
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
            if (!(application && (new Date().getTime() - application.lastLoggedIn.getTime() <= 5 * 60 * 60 * 1000))) {
                res.json({
                    'status': 2, 
                    'statusDesc': 'Authentication failure. Please check if accessKey is expired!!',
                    'version': 1.0,
                    'timestamp': new Date().getTime(), 
                    'request': req.query 
                }); 
            }
            else{

                var gid = req.param ("gid");
                var fs = require('fs');
                var jsonobj = JSON.parse(fs.readFileSync('registry.json', 'utf8'));

                gateways_list = jsonobj["gateways"];
                sensors_list = [];
                gindex = -1;

                for (var i = 0; i < gateways_list.length ; i++) {
                    console.log(gateways_list[i].id);
                    if(gateways_list[i].id == gid){
                        console.log("HIT");
                        gindex = i;
                        break;
                    }
                };

                if(gindex == -1){
                    console.log("BAD HIT");
                    res.json({
                        'status': 0,
                        'statusDesc': 'Payload Incorrect',
                        'version': 1.0,
                        'timestamp': new Date().getTime(),
                        'comments': "GatewayID Does not Exist.",
                        'request': req.query,
                        'data': null
                    })
                }

                if(req.query.active == undefined){
                    //Simply return all sensors connected to given gid.
                    sensors_list = gateways_list[gindex].list_of_sensors;
                }
                else{

                    var active = req.query.active;
                    sensors_list = gateways_list[gindex].list_of_sensors;
                    var tlen = sensors_list.length;
                    if(active == 1){
                        //Return List of active sensors.

                        for (var i = 0; i < tlen; i++) {
                            if(sensors_list[i].status == "down"){
                                sensors_list.splice(i,1);
                                i--;
                                tlen--;
                                console.log("HIT");
                            }
                        };
                    }
                    else{
                        //Return List of Dead sensors.
                        for (var i = 0; i < tlen; i++) {
                            if(sensors_list[i].status == "up"){
                                console.log(sensors_list[i].id);
                                sensors_list.splice(i,1);
                                i--;
                                tlen--;
                            }
                        };
                    }


                }

                if(sensors_list != []){
                    res.json({
                        'status': 1,
                        'statusDesc': 'Success',
                        'version': 1,
                        'GatewayID' : gid,
                        'timestamp': new Date().getTime(),
                        'comments': "List Of sensors",
                        'request': req.query,
                        'data': {"sensordata":sensors_list}
                    })
                }
                else{
                    res.json({
                        'status': 1,
                        'statusDesc': 'Success',
                        'version': 1,
                        'GatewayID' : gid,
                        'timestamp': new Date().getTime(),
                        'comments': "No Sensor Matched To Your Requirements.",
                        'request': req.query,
                        'data': {"sensordata":sensors_list}
                    })
                }
            }
        });
    }
});


module.exports = router;
