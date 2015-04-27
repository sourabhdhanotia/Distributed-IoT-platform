var express = require('express');
var router = express.Router();

router.get ('/', function (req, res, next) {
	if (req.query.lat == undefined || req.query.lon == undefined || req.query.range == undefined || req.query.accessKey == undefined)
	{
		res.json({
			'status': 0, 
			'statusDesc': 'Payload Incorrect',
			'version': 1.0,
			'timestamp': new Date().getTime(),
			'comments': null, 
			'request' : req.query, 
			'data': null
		})
	}
	else{

        Auth.findOne({token: req.query.accessKey}, function(err, application) {
            if (!(application && (new Date().getTime() - application.lastLoggedIn.getTime() > 5 * 60 * 60 * 1000))) {
                res.json({
                    'status': 2, 
                    'statusDesc': 'Authentication failure. Please check if accessKey is expired!!',
                    'version': 1.0,
                    'timestamp': new Date().getTime(), 
                    'request': req.query 
                }); 
            }
            else{
        		var lat = req.query.lat;
        		var lon = req.query.lon;
        		var range = req.query.range;


        		var fs = require('fs');
            	var jsonobj = JSON.parse(fs.readFileSync('registry.json', 'utf8'));

            	gateways_list = jsonobj["gateways"];
            	result_list = [];

            	for (var i = 0; i < gateways_list.length; i++) {
            		sensors_list = gateways_list[i].list_of_sensors;

            		for (var j = 0; j < sensors_list.length; j++) {
            			var tlat = sensors_list[j].location.lat ;
            			var tlon = sensors_list[j].location.lon ;
            			var dist = Math.sqrt(((tlat-lat)*(tlat-lat))+((tlon-lon)*(tlon-lon)));
            			if(dist <= range){
            				result_list.push(sensors_list[j]);
            			}
            		};
            	};

            	console.log(result_list.length);

            	if(req.query.active != undefined){
            		var active = req.query.active;
            		var tlen = result_list.length
            		if(active == 1){
            			//Return List of active sensors.
            			for (var i = 0; i < tlen; i++) {
            				if(result_list[i].status == "down"){
            					result_list.splice(i,1);
            					i--;
            					tlen--;
            				}
            			};
            		}
            		else{
            			//Return List of Dead sensors.
            			for (var i = 0; i < tlen; i++) {
            				if(result_list[i].status == "up"){
            					result_list.splice(i,1);
            					i--;
            					tlen--;
            				}
            			};
            		}
            	}

            	if(result_list != []){
        	    	res.json({
        	            'status': 1,
        	            'statusDesc': 'Success',
        	            'version': 1,
        	            'timestamp': new Date().getTime(),
        	            'comments': "List Of sensors in given range",
        	            'request':req.query,
        	            'data': {"sensordata":result_list}
        	        })
            	}
            	else{
            		res.json({
        	            'status': 1,
        	            'statusDesc': 'Success',
        	            'version': 1,
        	            'timestamp': new Date().getTime(),
        	            'comments': "No Sensor Matched To Your Requirements.",
        	            'request':req.query,
        	            'data': {"sensordata":result_list}
        	        })
            	}
            }
        });
    }


});


// code for sensorfamilyid specific location query
// added by naba
// 17/04/2015

router.get ('/:sensorFamilyId', function (req, res, next) {
    console.log (req.query)
    if (req.query.lat == undefined || 
        req.query.lon == undefined || 
        req.query.range == undefined || 
        req.query.accessKey == undefined)
    {
        // console.log ("lat" + req.query.lat)
        // console.log ("lon" + req.query.lon)
        // console.log ("range" + req.query.range)
        // console.log ("accessKey" + req.query.accessKey)

        res.json({
            'status': 0, 
            'statusDesc': 'Payload Incorrect',
            'version': 1.0,
            'timestamp': new Date().getTime(),
            'comments': null, 
            'request' : req.query, 
            'data': null
        })
    }
    else{

        Auth.findOne({token: req.query.accessKey}, function(err, application) {
            console.log(application);
            console.log (new Date().getTime() - application.lastLoggedIn.getTime());
            if (!application || (new Date().getTime() - application.lastLoggedIn.getTime() > 5 * 60 * 60 * 1000)) {
                console.log ("Auth error")
                res.json({
                    'status': 2, 
                    'statusDesc': 'Authentication failure. Please check if accessKey is expired!!',
                    'version': 1.0,
                    'timestamp': new Date().getTime(), 
                    'request': req.query 
                }); 
            }
            else{
                console.log ("In the success block");
                var lat = req.query.lat;
                var lon = req.query.lon;
                var range = req.query.range;
                console.log(req.params);
                console.log (parseInt(req.params["sensorFamilyId"]));
                familyid = parseInt(req.params["sensorFamilyId"]);
                // console.log (sensorFamilyId);

                var fs = require('fs');
                var jsonobj = JSON.parse(fs.readFileSync('registry.json', 'utf8'));

                gateways_list = jsonobj["gateways"];
                result_list = [];

                for (var i = 0; i < gateways_list.length; i++) {
                    sensors_list = gateways_list[i].list_of_sensors;

                    for (var j = 0; j < sensors_list.length; j++) {
                        var tlat = sensors_list[j].location.lat ;
                        var tlon = sensors_list[j].location.lon ;
                        var dist = Math.sqrt(((tlat-lat)*(tlat-lat))+((tlon-lon)*(tlon-lon)));
                        if(dist <= range && 
                            familyid == sensors_list[j].family_id){  //added for family specific query
                            result_list.push(sensors_list[j]);
                        }
                    };
                };

                // console.log(result_list.length);

                if(req.query.active != undefined){
                    var active = req.query.active;
                    var tlen = result_list.length
                    if(active == 1){
                        //Return List of active sensors.
                        for (var i = 0; i < tlen; i++) {
                            if(result_list[i].status == "down"){
                                result_list.splice(i,1);
                                i--;
                                tlen--;
                            }
                        };
                    }
                    else{
                        //Return List of Dead sensors.
                        for (var i = 0; i < tlen; i++) {
                            if(result_list[i].status == "up"){
                                result_list.splice(i,1);
                                i--;
                                tlen--;
                            }
                        };
                    }
                }

                if(result_list != []){
                    res.json({
                        'status': 1,
                        'statusDesc': 'Success',
                        'version': 1,
                        'timestamp': new Date().getTime(),
                        'comments': "List Of sensors in given range",
                        'request':req.query,
                        'data': {"sensordata":result_list}
                    })
                }
                else{
                    res.json({
                        'status': 1,
                        'statusDesc': 'Success',
                        'version': 1,
                        'timestamp': new Date().getTime(),
                        'comments': "No Sensor Matched To Your Requirements.",
                        'request':req.query,
                        'data': {"sensordata":result_list}
                    })
                }
            }
        });
    }

});



module.exports = router;
