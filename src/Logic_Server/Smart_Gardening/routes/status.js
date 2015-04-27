var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    //console.log(req.body);
    userAuth.findOne({userName:req.body.accessKey}, function(err, user){
		if( user.status == true ){
			//Forward the response to the end-user
			res.json({notification:true});
			user.status = false;
			user.save();
		}else{
			//Forward the response to the end-user
			res.json({notification:false});
		}
	});
    
});

module.exports = router;
