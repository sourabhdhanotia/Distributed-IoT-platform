var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var http = require('http');

//Mongoose connects to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://10.42.0.36/filterServer');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
commandList = [];
sendList = [];
storeList = [];


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

SensorData = mongoose.model('sensordata', new Schema({
    id: ObjectId,
    originGatewayId:
    {
        type: String
    },
    gatewayTimestamp:
    {
        type: Date
    },
    data:
    {
        type: JSON
    },
    updatedAt:
    {
        type: Date
    },
    createdAt:
    {
        type: Date
    }
}));
var app = express();

//Default Routes
var routes = require('./routes/index');
var users = require('./routes/users');

//Command APIs
var sensorFamilies = require('./routes/sensorFamilies');        //Added by VB
var commands = require('./routes/commands');                    //Added by SP
var sensorsRoute = require('./routes/sensors');                 //Added by AM

//Basic APIs
var login = require('./routes/login');                          //Added by VB

//Callback APIs
var callback = require('./routes/callback');                    //Added by VB
var callbackTest = require('./routes/callbackTest');

//Listening for data from gateway
var server = app.listen(8000);
var io     = require('socket.io').listen(server);

//Socket for validation of gatway ids with repository
var net = require('net');
var JsonSocket = require('json-socket');
var port = 9838;
var host = '10.42.0.1';
var client = new JsonSocket(new net.Socket());
var ini = false;
var repoFileJSON = {};

io.sockets.on('connection', function(socket) {
    socket.on ('sensorData', function (sensorDataObject, sendCommands) {

        console.log('-----------------------------------------------------------------------------');
        console.log("\nData received.\n".yellow);
        console.log(sensorDataObject);

        // Validate gateway ids
        var dataToSend = JSON.stringify({
            gatewayIds : sensorDataObject['gatewayIds']
        });

        var options = {
            host: '10.42.0.1',
            port: 3000,
            path: '/validateGatewayId',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataToSend)
            }
        };

        var req = http.request(options, function(res) {

            var message = '';
            res.on('data', function(chunk) {
                message += chunk;
            });

            res.on('end', function() {
                message = JSON.parse(message);
                if ( message.allPresent === true ) {
                    for (var i = sensorDataObject.data.length - 1; i >= 0; i--) {
                        var sensordata =new SensorData({
                            originGatewayId:sensorDataObject['originGatewayId'],
                            gatewayTimestamp:new Date(),
                            data:sensorDataObject.data[i],
                            createdAt:new Date(),
                            updatedAt:new Date()
                        });
            
                        sensordata.save(function(err) {
                            if(err) {
                               console.log("\nSomething Wrong while saving data.\n".red);
                            } else {
                               console.log("\nSuccessfully saved data.\n".green);
                            }
                        });
                    }
                } else {
                   console.log("\nInvalid gatewayIds.\n".red);
                }
            });
        });

        req.on('error', function(err) {
            console.log(err);
        });

        req.write(dataToSend);
        req.end();
        
        //Sending commands to gateway
        if ( commandList.length > 0 ) {
            for (var i = commandList.length - 1; i >= 0; i--) {
                if( commandList[i].gatewayId == sensorDataObject['originGatewayId'] )
                    sendList[sendList.length] = commandList[i];
                else
                    storeList[storeList.length] = commandList[i];
            };
            console.log('\nCommand Sent\n'.yellow);
            console.log(JSON.stringify({'commandList': sendList}).yellow);
            sendCommands({'commandList': sendList});
            console.log('-----------------------------------------------------------------------------');
            commandList = storeList;
            sendList = [];
            storeList = [];
        }
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/sensorFamilies', sensorFamilies);                     //Added by VB
app.use('/callback', callback);                                 //Added by VB
app.use('/callbackTest', callbackTest);                         //Added by VB
app.use('/login', login);                                       //Added by VB
app.use('/commands', commands);                                 //Added by SP
app.use('/sensors', sensorsRoute);                              //Added by SP

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
