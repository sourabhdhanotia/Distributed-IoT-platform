
var path = require('path');
var express = require('express');
var router = express.Router();
var fs = require ('fs');

var registryFilePath = path.join(__dirname, '..', 'registry.json');       // naba
var repoFilePath = path.join (__dirname, '..', 'repository.json');  		// naba

router.post('/', function(req, res, next) {
    var gatewayIds = req.body.gatewayIds;
    console.log ("gatewayIds : " + gatewayIds);
    fs.readFile (repoFilePath, function (err, repoFileData)
    {
        if (!err)
        {
            repoFileJSON = JSON.parse (repoFileData);
            gatewaysInRepo = repoFileJSON.gateways;
            var allPresent = true;
            for (var i = 0; i < gatewayIds.length; i++)
            {
                var thisPresent = false;
                for (var j = 0; j < gatewaysInRepo.length; j++)
                {
                    // console.log ("thisPresent " + thisPresent);
                    if (gatewaysInRepo[j].id == gatewayIds[i])
                    {
                        thisPresent = true;
                        break;
                    }
                }
                if (!thisPresent)
                {
                    allPresent = false;
                    break;
                }
            }
            if (allPresent)
            {
                console.log ('true');
                res.json ({allPresent : true});
            }
            else
            {
                console.log ('false');
                // jsonSocket.sendEndMessage({allPresent : false});
                res.json ({allPresent : false});
            }
        }
        else
        {
            console.log ("something went wrong!!");
            throw err;
        }
    });
});

module.exports = router;
