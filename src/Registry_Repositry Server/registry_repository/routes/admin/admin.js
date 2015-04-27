var express = require('express');
var router = express.Router();


router.get('/',function(req,res,next){

    console.log("ADMIN HOME PAGE");
    res.render('details.html',{'value':'<div></div>'});

});

router.post('/',function(req,res)
{                  
    console.log(req.body);                  
    res.render("details.html",{'value':"<div style=\"display: block;\" class=\"flash\">Successful Log In<span id=\"closeflash\"></span></div>"});                     
});


router.get('/:infotype', function(req, res, next) {

	var fs = require('fs');

    var jsonobj = JSON.parse(fs.readFileSync('repository.json', 'utf8'));

    gateways_list = jsonobj["gateways"];

    var value = "";

    if(req.param ("infotype") == "gateways"){

        var tempval = "<tr><th>Gateway ID</th><th>Active Status (true/false)</th></tr>";

        for (var i = 0; i < gateways_list.length; i++) {
        	tempval = tempval + "<tr><td>" + gateways_list[i].id + "</td><td>" + gateways_list[i].is_active + "</td></tr>"
        };

        value = value + tempval;
        console.log(value);
        res.render('details.html',{
            'value':value
        });
    }
    else if(req.param ("infotype") == "sensors"){

        var tempval = "<tr><th>Gateway ID</th><th>Sensor ID</th><th>Series</th><th>Manufacturer</th><th>Location Latitude</th><th>Location Longitude</th><th>Protocol</th><th>Family</th></tr>";
        var value = "";

        for (var i = 0; i < gateways_list.length; i++) {
            sensor_list = gateways_list[i].list_of_sensors;

            for (var j = 0; j < sensor_list.length; j++) {
                tempval = tempval + "<tr><td>" + gateways_list[i].id + "</td><td>" + sensor_list[j].id  + "</td><td>" + sensor_list[j].series + "</td><td>" + sensor_list[j].manufacturer  + "</td><td>" + sensor_list[j].location.lat  + "</td><td>" + sensor_list[j].location.lon  + "</td><td>" + sensor_list[j].protocol  + "</td><td>" + sensor_list[j].family_id + "</td></tr>" ;
            };
        };

        value = value + tempval;

        console.log(value);
        res.render('details.html',{
            'value':value
        });
    }
    else if(req.param ("infotype") == "ginfo"){

        var value = "<tr><th colspan=2><center>DEVELOPERS INFO</center></th></tr><tr><th>NAME</th><th>ROLL NUMBER</th></tr><tr><td>Veerendra</td><td>2014055XX</td></tr><tr><td>Atul</td><td>2014055XX</td></tr><tr><td>Abhinaba</td><td>2014055XX</td></tr><tr><td>Lokesh</td><td>2014055XX</td></tr><tr><td>Saurabh</td><td>2014055XX</td></tr><tr><td>Swapnil</td><td>2014055XX</td></tr><tr><td>Abhishek</td><td>2014055XX</td></tr><tr><td>Pankaj</td><td>2014055XX</td></tr><tr><td>Prerna</td><td>2014055XX</td></tr><tr><td>Aditi</td><td>201405549</td></tr>"

        res.render('details.html',{
            'value':value
        });

    }


});

module.exports = router;