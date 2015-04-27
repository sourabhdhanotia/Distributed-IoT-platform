var express = require('express');
//var bodyParser = require('body-parser');
var router = express.Router();

router.post('/', function(req, res) {


} );

module.exports = router;    




function test() {
    var data = {temp : 39, humidity: 95};

    var postData = require('querystring').stringify(data);
    //console.log(postData);

    var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/callbackTest',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(postData);
    req.end();
}