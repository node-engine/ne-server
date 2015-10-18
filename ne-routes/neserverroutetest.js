var express = require('express');
var router = express.Router();

var neserverroutetest = function (server){

    router.get('/', function(req, res, next){

        res.send("neserverroutetest working")

    });

    server.use('/neserverroutetest', router);

};

module.exports = neserverroutetest;
