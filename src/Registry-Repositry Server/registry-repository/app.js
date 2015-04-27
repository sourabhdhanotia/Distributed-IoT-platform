/**
 * v1.0
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var fs = require ('fs');   

// required for node to node connection
var net = require('net'),                                           // naba
    JsonSocket = require('json-socket');                                                         // naba

//required for health ping updates
var registryFilePath = path.join(__dirname, 'registry.json');       // naba
var repoFilePath = path.join (__dirname, 'repository.json');       // naba

//threshold for making the sensor dead in milliseconds
var threshold = 600;                                                // naba

var routes = require('./routes/index');
var users = require('./routes/users');
var addgateway = require('./routes/admin/addgateway');                              // PC
var sensorsByFamilies = require('./routes/repository/sensorsByFamilies');          // ASR
var sensorsByProtocol = require('./routes/repository/sensorsByProtocol');          // ASR
var gateways = require('./routes/repository/gateways');                            // ASR

// ----------------------------------------------------------------------
// Added By Aditi Jain For Security.
// Mongoose connects to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.42.0.36/filterServer');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


Auth = mongoose.model('auth', new Schema({
    id: ObjectId,
    appname:
    {
        type: String,
        unique: true
    },
    password:
    {
        type: String
    },
    createdAt:
    {
        type: Date
    },
    updatedAt:
    {
        type: Date
    },
    lastLoggedIn:
    {
        type: Date
    },
    token:
    {
        type: String
    }
},{strict: true}));
//------------------------------------------------------------------

//Added by Aditi Jain.
var reg_gateway = require('./routes/registry/gateway');
var reg_family = require('./routes/registry/family');
var reg_location = require('./routes/registry/location');
var admin = require('./routes/admin/admin');
var validation = require ('./routes/validateGatewayId')

var app = express();
var multer = require('multer');

// sends the apk to the gateway
app.get('/',function(req, res) 
{
  res.sendFile(__dirname + '/app-debug.apk');
});

//part required for socket.io with gateway
var server = app.listen (11000);                                    // naba    
var io = require('socket.io').listen (server);                      // naba

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.engine('html', require('ejs').renderFile);

//uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({dest:'./uploads/'}));
app.use(flash());


app.use('/', routes);
app.use('/users', users);
app.use('/repository/sensors/families', sensorsByFamilies);             // ASR
app.use('/repository/sensors/protocol', sensorsByProtocol);             // ASR
app.use('/repository/gateways', gateways);                              // ASR
app.use('/admin/addgateway', addgateway);                               // PC


//Added by Aditi Jain.
app.use('/registry/gateway', reg_gateway);    
app.use('/registry/sensors/family', reg_family);   
app.use('/registry/sensors/location', reg_location);  
app.use('/admin', admin);

// for validation of gateways from filter server
app.use ('/validateGatewayId', validation);


//----------- admin login page(PC)---------------------------
app.get('/login',function(req,res)
{                              
    res.render("login.html",{});                
});


//-----------------------------------------------------------------                                                                    

//catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// -----------------------------------------------------------------------------------
// code for opening port to filter server
// node to node communication using net and json-sockets
// works for gatewaty validation
// Author : Naba
/* moved to REST */
/* check with Routes */

// ---------------------------------------------------------------------------------

/* 
 * Code for
 * (1) Dunno what is that - Added by ASR
 * (2) Intial communication from gateway to repo - returns the list of sensors added to the gateway
 * (3) updating the registry.json for the health pings
 * Author : naba
 */
io.sockets.on('connection', function(socket) {
    
    // (1)
    socket.on ('sensorData', function (sensorDataJObject) {
        console.log(sensorDataJObject);
        socket.emit('command', "{cmd: 'ON', sid: 1234}");
    });

    // (2) intial connection from gateway to repository
    socket.on ('init message', function (data, callback) 
    {
        repoFileData = fs.readFileSync (repoFilePath);
        repoFileJSON = JSON.parse (repoFileData);

        console.log (data);

        for (var i = repoFileJSON.gateways.length - 1; i >= 0; i--) {
            if (repoFileJSON.gateways[i].id == parseInt (data))
            {
                responseJSON = { "list_of_sensors" : []};
                for (var j = repoFileJSON.gateways[i].list_of_sensors.length - 1; j >= 0; j--) {
                    var len = responseJSON.list_of_sensors.length;
                    responseJSON.list_of_sensors[len] = { "id" : repoFileJSON.gateways[i].list_of_sensors[j].id, "protocol" : repoFileJSON.gateways[i].list_of_sensors[j].protocol };
                }; // end for sensors
                callback (responseJSON);
                break;
            }
        }; // end for gateways
    });
    
    // (3) block for health - ping
    socket.on ('healthPing', function (healthPingData) {

        // test
        console.log("Health Ping received");
        console.log (healthPingData)

        console.log ((new Date().getTime ()));

        // healthPingJSON = JSON.parse (healthPingData);
        healthPingJSON = healthPingData;
        gatewayId = parseInt (healthPingJSON.gateway_id);    //gateway id sent by health ping

        // console.log ("received gateway id" + gatewayId);

        //check whether the gateway id and the sensor ids present in the gateway
        var isGatewayPresentInRepo = false;
        var isSensorPresentInRepo = false;
        var isSensorPresentInRegistry = false;
        var isGatewayPresentInRegistry = false;
        var allSensorsPresent = false;

        // code for reading repo to check for validity of gateway and sensor
        repoFileData = fs.readFileSync (repoFilePath)
        repoJSON = JSON.parse (repoFileData);
        isGatewayPresentInRepo = false;

        for (var i = repoJSON.gateways.length - 1; i >= 0; i--) 
        {
            if (parseInt (repoJSON.gateways[i].id) == gatewayId)
            {
                repoJSON.gateways[i].is_active = true;
                isGatewayPresentInRepo = true;
                // isSensorPresentInRepo = false;
                
                allSensorsPresent = true

                sensorList = repoJSON.gateways[i].list_of_sensors;
                sensorListFromPing = healthPingJSON.sensorData
                
                // console.log (sensorList)
                // console.log (sensorListFromPing)

                for (var j = sensorListFromPing.length - 1; j >= 0; j--) {
                    thisSensorPresent = false;
                    for (var k = sensorList.length - 1; k >= 0; k--) 
                    {
                        if (sensorList[k].id == healthPingJSON.sensorData[j].sensor_id)
                        {
                            thisSensorPresent = true;
                            break;
                        }
                    };

                    if (!thisSensorPresent)
                    {
                        allSensorsPresent = false;
                        break;
                    }
                };
                
                break;
            } 
        };

        fs.writeFileSync (repoFilePath, JSON.stringify (repoJSON, null, 4));

        // console.log (allSensorsPresent);
        // console.log (isGatewayPresentInRepo);

        // registry file to be updated only when the sensor and the gateway is valid
        if (allSensorsPresent && isGatewayPresentInRepo)
        {   
            // this is the event for registry file read
            registryFileData = fs.readFileSync (registryFilePath);

            var registryJSON = JSON.parse (registryFileData);
            // registryJSON = registryFileData;
            var isGPS;
            // console.log ("family id " + healthPingJSON.sensor_family_id)
            if (healthPingJSON.sensor_family_id == 22)
            {
                isGPS = true;
            }
            else
            {
                isGPS = false;
            }

            // code for updating registry 
            for (var i = registryJSON.gateways.length - 1; i >= 0; i--) 
            {
                // gateway is present in the registry file
                if (registryJSON.gateways[i].id == gatewayId)
                {
                    isGatewayPresentInRegistry = true;
                    registryJSON.gateways[i].last_seen_timestamp = healthPingJSON.gateway_timestamp;

                    isSensorPresentInRegistry = false;
                
                    // now iterate over the sensors connected to this gateway
                    for (var k = healthPingJSON.sensorData.length - 1; k >= 0; k--)
                    {
                        for (var j = registryJSON.gateways[i].list_of_sensors.length - 1;
                             j >= 0; j--) 
                        {
                            isSensorPresentInRegistry = false;
                            if (registryJSON.gateways[i].list_of_sensors[j].id 
                                == healthPingJSON.sensorData[k].sensor_id)
                            {
                                isSensorPresentInRegistry = true;

                                // normal timestamp update
                                registryJSON.gateways[i].list_of_sensors[j].timestamp = healthPingJSON.sensorData[k].sensor_timestamp;
                                registryJSON.gateways[i].list_of_sensors[j].status = "up";

                                console.log ("timestamp update");
                                
                                // gps specific
                                // if (healthPingJSON.sensorData[k].sensor_family_id == 22)
                                // update for all sensors now
                                // change 18/04/15T16:38
                                if (true)
                                {
                                    registryJSON.gateways[i].list_of_sensors[j].location.lat = healthPingJSON.sensorData[k].lat;
                                    registryJSON.gateways[i].list_of_sensors[j].location.lon = healthPingJSON.sensorData[k].lon;
                                    console.log ("gps update");
                                }
                                break;
                            } // end for sesnor
                        };
                        // if new sensor needs to be added
                        if (!isSensorPresentInRegistry)
                        {
                            var newSensor = { 
                                "id": healthPingJSON.sensorData[k].sensor_id, 
                                "status" : "up", 
                                "location" : 
                                { 
                                    "lat" : healthPingJSON.sensorData[k].lat, 
                                    "lon" : healthPingJSON.sensorData[k].lon
                                }, 
                                "family_id" : healthPingJSON.sensorData[k].sensor_family_id,
                                "timestamp" : healthPingJSON.sensorData[k].sensor_timestamp
                            };
                            var len = registryJSON.gateways[i].list_of_sensors.length;
                            registryJSON.gateways[i].list_of_sensors[len] = newSensor;
                            console.log ("new sensor added");
                        }
                    };

                    
                    // break;
                } // end if

                // this part is for updating the status when last seen is long gone
                /* for (var j = registryJSON.gateways[i].list_of_sensors.length - 1; j >= 0; j--) 
                {
                    if ((new Date().getTime ()) - (registryJSON.gateways[i].list_of_sensors[j].timestamp) > threshold)
                    {
                        registryJSON.gateways[i].list_of_sensors[j].status = "down";
                        console.log ("making sensor id:" + registryJSON.gateways[i].list_of_sensors[j].id.toString() + "down");
                    }
                }; //end for sensor */
            }; //end for gateways

            // need to add a new gateway with a new sensor
            if (!isGatewayPresentInRegistry)
            {
                var newGateway = {
                    "id" : healthPingJSON.gateway_id,
                    "status" : "up",
                    "last_seen_timestamp" : healthPingJSON.gateway_timestamp,
                    "list_of_sensors" : []
                }
                for (var k = healthPingJSON.sensorData.length - 1; k >= 0; k--)
                {
                    var newSensor = { 
                        "id": healthPingJSON.sensorData[k].sensor_id,
                        "status" : "up", 
                        "location" : {
                            "lat" : healthPingJSON.sensorData[k].lat, 
                            "lon" : healthPingJSON.sensorData[k].lon
                        },
                        "family_id" : healthPingJSON.sensorData[k].sensor_family_id, 
                        "timestamp" :  healthPingJSON.sensorData[k].sensor_timestamp 
                    };
                    // var newGateway = { "id" : healthPingJSON.gateway_id, "status" : "up", "last_seen_timestamp" : healthPingJSON.gateway_timestamp, "list_of_sensors" : [newSensor] };
                    lenList = newGateway.list_of_sensors.length;
                    newGateway.list_of_sensors[lenList] = newSensor;
                    // console.log (JSON.stringify (newSensor));
                    // console.log (JSON.stringify (newGateway)); 
                }
                var len = registryJSON.gateways.length;
                registryJSON.gateways[len] = newGateway;

                console.log ("added new gateway and sensor");
            }

            // write the file back 
            // fs.writeFileSync (registryFilePath, JSON.stringify (registryJSON, null, 4));
            fs.writeFileSync (registryFilePath, JSON.stringify (registryJSON, null, 4));

        } //end of validated block
        else
        {
            console.log ("silent drop");
        }

    });
});
// ----------------------------------------------------------------------
module.exports = app;
