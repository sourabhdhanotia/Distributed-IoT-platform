/* Use this as template to write POST & GET functions.
   Tested via POSTMAN.
*/

var express = require('express');
var router = express.Router();

//var httpProxy = require('http-proxy');
//var apiProxy = httpProxy.createProxyServer();


/* Dummy POST */
router.post('/', function(req, res, next) {
    console.log(req.body);

    //apiProxy.web(req, res, { target: 'proxy.iiit.ac.in:80' });

    res.json({'status':1, 'comments': 'Testing POST hit'});
});


/* Dummy GET */
router.get('/', function(req, res, next) {
    res.json({'status':1, 'comments': 'Testing GET hit'});

});

/*
app.get("/api/*", function(req, res){ 
  apiProxy.web(req, res, { target: 'http://google.com:80' });
});
*/
module.exports = router;