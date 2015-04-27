var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
	console.log("\n ---- Inside Hit me ");
    console.log(req.body);
    
    userAuth.findOne({userName:req.body.requestId}, function(err, user){
		if( user ){
			user.status = true;
			user.save();
		}
	});
    
    //Forward the response to the end-user
    res.json({notification:true});
    
});

module.exports = router;
