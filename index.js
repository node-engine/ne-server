var express = require('express');
var debug = require('debug')('express:server');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cors = require('cors');

var nodeEngine = {};

nodeEngine.server = function(config){

    var server = express();

    ///////////////////
    //    MongoDB    //
    ///////////////////

    // This is used for mongodb and the api stuff cross origin resource sharing
        server.use(cors());

    // for the rest API post, put requests
        server.use(bodyParser.urlencoded({ extended: false }));
        server.use(bodyParser.json());
        server.use(bodyParser.raw());
        server.use(bodyParser.text());


    ////////////////////
    // Static Assets  //
    ////////////////////

        var cacheTime = config.env.CACHETIME;

        server.use(express.static('media',{ maxAge: cacheTime }));
        server.use(express.static(path.join(__dirname, '/static'),{ maxAge: cacheTime }));
        server.use(express.static(path.join(__dirname, '/universal/css'),{ maxAge: cacheTime }));
        server.use(express.static(path.join(__dirname, '/universal/js'),{ maxAge: cacheTime }));


    /////////////////////////
    // Server Boilerplate  //
    /////////////////////////

    // Get port from environment and store in Express.
        var port = normalizePort(process.env.PORT || config.env.PORT || '3000');
        server.set('port', port);

    //Normalize a port into a number, string, or false.
        function normalizePort(val) {
            var port = parseInt(val, 10);

            if (isNaN(port)) {
                // named pipe
                return val;
            }

            if (port >= 0) {
                // port number
                console.log("App is running on Port: " + port);
                return port;
            }

            return false;
        }

};


/////////////////////////
//       Export        //
/////////////////////////

module.exports = nodeEngine;