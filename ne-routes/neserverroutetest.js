var neAuto;
if(process.env.NE_AUTO){
    neAuto = process.env.NE_AUTO
}
else {
    neAuto = "ne-auto-off"
}

var express = require(neAuto).express || require('express');

var router = express.Router();

var neserverroutetest = function (server){

    router.get('/', function(req, res, next){

        res.send("neserverroutetest working")

    });

    server.use('/neserverroutetest', router);

};

module.exports = neserverroutetest;
