/**
 * Created by veerendra on 24/3/15.
 */
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
//router.use(bodyParser());

/* Gateways sends its data to filter server via this URL, which server will dump in DB */

/*
{ isDirect: '1',
  gatewayID: '223',
  originGatewayID: '33',
  sensorID: '322',
  sensorData: '33' }
*/
router.post('/', function(req, res) {
    
	
    if( req.body.gatewayID === undefined || req.body.isDirect == undefined  || req.body.originGatewayID == undefined || req.body.sensorID == undefined || req.body.sensorData == undefined   ){
        
        status=0;
        statusDesc="Payload Incorrect"
    }else{
        status=1;
        statusDesc="Success"
    }
	
	

    res.json({'status': status, 'statusDesc':statusDesc,'version': 1.0,'timestamp': new Date().getTime()} ) 

});
module.exports = router;
