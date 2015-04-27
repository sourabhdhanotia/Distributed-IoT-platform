/**
 * Created by veerendra on 10/4/15.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

/* POST home page.
 * A list of status to help in debugging
 * 0 - Authentication failure. Invalid password.
 * 1 - App Authenticated Successfully.
 * 2 - No such App Name exists.
 * 3 - App already logged in.
 */
router.post('/', function(req, res, next) {
    Auth.findOne({appName: req.body.appName}, function(err, application) {
        if ( !application ) {
            res.json({'status': 2, 'comments': 'No such App Name exists.', 'accessToken': null});
        } else {
            var bcrypt = require('bcryptjs');
            if (bcrypt.compareSync(req.body.password, application.password)) {
                var token = crypto.randomBytes(48).toString('hex');
                var date = new Date();
                console.log(date.getTime() - application.lastLoggedIn.getTime());
                if(date.getTime() - application.lastLoggedIn.getTime() > 5*60*60*1000){ // 2 hrs is our session duration
                    application.lastLoggedIn = new Date();
                    application.token = token;
                    application.save();
                    res.json({'status': 1, 'comments': 'App Authenticated Successfully', 'accessToken': token});
                }else{
                    res.json({'status': 3, 'comments': 'App already logged in', 'accessToken': application.token});
                }
            } else {
                res.json({'status': 0, 'comments': 'Authentication failure. Invalid password.', 'accessToken': null});
            }
        }
    });
});

module.exports = router;
