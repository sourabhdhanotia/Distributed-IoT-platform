//Written by Aditi Jain.

var express = require('express');
var router = express.Router();

router.get('/:familyid', function(req, res, next) {

	 if (req.param ("familyid") == undefined || req.query.accessKey == undefined) {
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

                var familyid = req.param ("familyid");
                var fs = require('fs');
                var jsonobj = JSON.parse(fs.readFileSync('registry.json', 'utf8'));

                gateways_list = jsonobj["gateways"];
                sensors_list = [];

                for (var i = 0; i < gateways_list.length ; i++) {   
                    
                    for (var j = 0; j < gateways_list[i].list_of_sensors.length; j++) {
                        if(gateways_list[i].list_of_sensors[j].family_id == familyid) {
                            sensors_list.push(gateways_list[i].list_of_sensors[j]);
                            console.log(gateways_list[i].list_of_sensors[j])
                        }
                    };
                };

                console.log(sensors_list.length);

                if(req.query.active != undefined){
                    console.log("HIT");
                    var active = req.query.active;
                    tlen = sensors_list.length;
                    if(active == 1){
                        //Return List of active sensors.
                        for (var i = 0; i < tlen; i++) {
                            if(sensors_list[i].status == "down"){
                                sensors_list.splice(i,1);
                                i--;
                                tlen--;
                            }
                        };
                    }
                    else{
                        //Return List of Dead sensors.
                        for (var i = 0; i < tlen; i++) {
                            console.log(tlen,"  ",sensors_list[i].id,"  ",sensors_list[i].family_id , "  " , sensors_list[i].status);
                            if(sensors_list[i].status == "up"){
                                //console.log(sensors_list[i].id,"  ",sensors_list[i].family_id , "  " , sensors_list[i].status);
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
