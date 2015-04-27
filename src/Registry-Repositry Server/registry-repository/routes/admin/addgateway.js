var express = require('express');
var router = express.Router();
// var lastSensorId = 1001;

router.get('/', function(req, res, next) {
    console.log("ADDGATEWAY PAGE");
    res.render('addgateway.html', {
        'value': '<div></div>'
    });

});


router.post('/', function(req, res) {
    console.log("Inside");
    var fs = require('fs');
    var obj;
    gateway_exists = "0";
    var gateway_id = req.body.full_name;
    var family = req.body.phone;
    var manufacturer = req.body.address_line1;
    var series = req.body.address_line2;
    var protocol = req.body.city;
    var latitude = req.body.lat;
    var longitude = req.body.longitude;
    chk = 1;
    value = "";
    console.log("Request files" + req.files.datafile);
    console.log("Gateway id" + gateway_id);
    item = [];
    sensor = [];


    if (req.files.datafile != undefined) {
        fs.readFile(req.files.datafile.path, function(err, data) {
            fs.writeFile("uploads/" + req.files.datafile.originalname, data, function(err) {
                fs.unlink(req.files.datafile.path, function() {
                    if (err) throw err;
                });
            });
        });
    }

    fs.readFile('repository.json', 'utf8', function(err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
        console.log(obj);
        item = obj["gateways"];
        item.forEach(function(gateway) {
            if (gateway.id == gateway_id) {
                gateway_exists = "1";
		console.log("inside match");
                if (gateway.is_active == false) {			//Changed
                    sensor = gateway["list_of_sensors"];
                    var last = sensor[sensor.length - 1];
                    sensor_id = parseInt(last.id) + 1;
                    dataToBeSent = {
                        id: Number(sensor_id),                           //Changed
			status: "up",
                        location: {
                            lat: Number(latitude),			//Changed
                            lon: Number(longitude)			//Changed
                        },
                        family_id: Number(family),			//Changed
                        protocol: protocol,
                        manufacturer: manufacturer,
                        series: series
                    }
                    console.log(dataToBeSent);
                    sensor.push(dataToBeSent);
                    // sensor.push(JSON.parse("{ \"id\" : \"" +sensor_id + "\" , \"location \" : { \"lat\" : \"" +latitude + "\" , \"lon\": \"" +longitude + "\"}, \"family_id \" :\"" +family+ "\", \"protocol\" : \"" +protocol+ "\", \"manufacturer\" : \"" +manufacturer + "\" , \"series\" : \""+series+ "\"}"));									
                    fs.writeFile('repository.json', 
                    	JSON.stringify(obj, null, 4), function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("JSON saved to ");
                        }
                    });
                    res.render("addgateway.html", {
                        'value': ""
                    });

                } 
                else {

                    console.log("Gateway already active. Cannot add sensor to Gateway");
                    chk = 1;
                    res.render('addgateway.html', {
                        'value': "<div style=\"display: block;\" class=\"flash\">Gateway already active. Cannot add sensor to Gateway<span id=\"closeflash\"></span></div>"
                    });
                }
            }

        })

        if (chk == 1) 
        {
            value = "Gateway already active. Cannot add sensor to Gateway";
        }

        if (gateway_exists == "0") 
        {
            var sensor_id = gateway_id + 1;
            dataToBePushed = {
                id: Number(gateway_id),				//Changed
                is_active: false,
                list_of_sensors: [{
                    id: Number(sensor_id),			//Changed
		    status: "up",
                    location: {
                        lat: Number(latitude),			//Changed
                        lon: Number(longitude)			//Changed
                    },
                    family_id: Number(family),			//Changed
                    protocol: protocol,
                    manufacturer: manufacturer,
                    series: series
                }]
            }
            item.push(dataToBePushed);
            console.log("New gateway added : " + dataToBePushed);
            // item.push(JSON.parse("{ \"id\" : \"" +gateway_id + "\" , \"is_active \" : \"false\" ,\"list_of_sensors\": [{  \"id\" : \"" +sensor_id + "\" , \"location \" : { \"lat\" : \"" +latitude + "\" , \"lon\": \"" +longitude + "\" }, \"family_id \" :\"" +family+ "\", \"protocol\" : \"" +protocol+ "\", \"manufacture\" : \"" +manufacturer + "\" , \"series\" : \""+series+ "\"}]}"));							
            fs.writeFile('repository.json', 
            	JSON.stringify(obj, null, 4), function(err) 
            	{
	                if (err) 
	                {
	                    console.log(err);
	                } else 
	                {
	                    console.log("JSON saved to ");
	                }
                res.render("addgateway.html", {
                    'value': ""
                });
            });
        }
    });
    // }


    // });									
    console.log("Finished");


});
//--------------------------------------------------
module.exports = router;
