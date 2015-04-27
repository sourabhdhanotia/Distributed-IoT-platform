/**
 * Created by veerendra on 10/4/15.
 */
var express = require('express');
var router = express.Router();

var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();


/* POST home page. */
router.post('/', function(req, res, next) {
    console.log(req.body);

    //apiProxy.web(req, res, { target: 'proxy.iiit.ac.in:80' });

    res.json({'status':1, 'comments': 'Data successfully received at Logic Server'});
});

/*
app.get("/api/*", function(req, res){ 
  apiProxy.web(req, res, { target: 'http://google.com:80' });
});
*/
module.exports = router;