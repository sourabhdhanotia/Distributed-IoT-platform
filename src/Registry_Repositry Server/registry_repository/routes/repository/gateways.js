var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    if (req.query.accessKey == undefined) {
        res.json({
            'status': 0,
            'statusDesc': 'Payload Incorrect',
            'version': 1.0,
            'timestamp': new Date().getTime(),
            'comments': null,
            'request': req.query,
            'data': null
        })
    }
    else{

        //Added By Aditi Jain For Security.
        Auth.findOne({token: req.query.accessKey}, function(err, application) {
            if (!(application && (new Date().getTime() - application.lastLoggedIn.getTime() <= 2 * 60 * 60 * 1000))) {
                res.json({
                    'status': 2, 
                    'statusDesc': 'Authentication failure. Please check if accessKey is expired!!',
                    'version': 1.0,
                    'timestamp': new Date().getTime(), 
                    'request': req.query 
                }); 
            }
            else{
                //-------------Added by PC-----------------------
                var fs = require('fs');                         
                var obj;                                
                var gateways_list = [];                         
                fs.readFile('repository.json', 'utf8', function (err, data) {       
                    if (err) throw err;                     
                    obj = JSON.parse(data);                     
                    var item = obj.gateways;                    
                    item.forEach(function(gateway){                 
                        console.log(gateway.id);                    
                    gateways_list.push(gateway.id);                 
                    })                                        
                    res.json({
                        'status': 1, 
                        'statusDesc':'Success',
                        'version': 1.0,
                        'timestamp': new Date().getTime (),
                        'data':{'gateway_data': gateways_list}
                    });
                });                   
            }
        });
    }

				
				
});
//--------------------------------------------------
module.exports = router;
