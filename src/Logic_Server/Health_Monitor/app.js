var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
filterServerAccessKey = "";

//-------------------------Global Variables 
testingGlobal=''
//accessKey=""
listSensorTypes=""
listOperators=""
listValues=''
listOfSensorIds=''
globalUsername=''
filterServerAccessToken=''

sensorFamilyIdList = [11, 12, 13];


logicServerIP='10.42.0.49'
filterServerIP='10.42.0.36'
registryServerIP='10.42.0.1'

//-------------------------------------DB connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/healthMonitorLogicServer');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
userAuth = mongoose.model('userauth', new Schema({
    id: ObjectId,
    userName:
    {
        type: String,
        unique: true
    },
    password:
    {
        type: String
    },
    status:
    {
      type: Boolean
    },
    createdAt:
    {
        type: Date
    },
    updatedAt:
    {
        type: Date
    },
    lat:
    {
        type: Number
    },
    lon :
    {
        type : Number
    }
},{strict: true}));



//-------------------------Added by me
var sensorFamilies = require('./routes/sensorFamilies');   
var gateways = require('./routes/gateways');  
var callbackTest = require('./routes/callbackTest') 
var logicServerCode = require('./routes/logicServerCode')
var hitMe = require('./routes/hitMe');
var status = require('./routes/status');

var testPostGetJson = require('./routes/testPostGetJson')
var authenticateUser = require('./routes/authenticateUser')
var testingAditiCode = require('./routes/testingAditiCode')
var getRulesFromUser = require('./routes/getRulesFromUser')
var sendSensorDataToUser = require('./routes/sendSensorDataToUser')

var getCommandFromUser = require('./routes/getCommandFromUser')



var app = express();

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

//-------------------------Added by me
app.use('/sensorFamilies', sensorFamilies); 
app.use('/gateways', gateways);     
app.use('/callbackTest', callbackTest)  
app.use('/logicServerCode', logicServerCode)  
app.use('/hitMe', hitMe); 
app.use('/status', status);

app.use('/testPostGetJson', testPostGetJson)
app.use('/authenticateUser', authenticateUser)
app.use('/testingAditiCode', testingAditiCode)
app.use('/getRulesFromUser', getRulesFromUser)
app.use('/sendSensorDataToUser', sendSensorDataToUser)

app.use('/getCommandFromUser', getCommandFromUser);


//-------------------------------------------------------------------------------------------------
  /* Get AccessToken from filter Server */
  var http = require('http');
  var dataToSend = JSON.stringify({
        appName : "App1",
        password : "password"
    })

    var options = {
      host : filterServerIP,
      port : 3000,
      path : '/login',
      method : 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataToSend)
    }
    };

    var req = http.request(options, function(res) {
      var result = '';

      res.on('data', function(chunk) {
        result += chunk;
      });

      res.on('end', function() {
        //console.log("Response from /login : " + result);
        jsonObject = JSON.parse(result);

        console.log("\n[app.js]  AccessToken received from filter server : " + jsonObject.accessToken);
        filterServerAccessToken=jsonObject.accessToken;
        
      });
  });

  req.on('error', function(err) {
    console.log(err);
  });

  req.write(dataToSend);
  req.end();
  

//----------------------------------------------------------------------------------------------------


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
