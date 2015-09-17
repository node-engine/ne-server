var express = require('express');
var debug = require('debug')('express:server');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cors = require('cors');

var neServer = {};

neServer.init = function(currentEnv, configDevelopment, configProduction){

    var server = express();

    if ('development' == currentEnv) {
        server.locals.config = configDevelopment.env;
        var config = server.locals.config;
        console.log('Using Development CONFIG');
        mongoose.connect(process.env.MONGO_URL || server.locals.config.MONGO_URL);
    }

    if ('production' == currentEnv) {
        server.locals.config = configProduction.env;
        var config = server.locals.config;
        console.log('Using Production CONFIG');
        mongoose.connect(process.env.MONGO_URL || server.locals.config.MONGO_URL);
    }

    // This is used for mongodb and the api stuff cross origin resource sharing
    server.use(cors());

    // for the rest API post, put requests
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(bodyParser.raw());
    server.use(bodyParser.text());

    // Get port from environment and store in Express.
    var port = normalizePort(process.env.PORT || config.PORT || '3000');
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
            console.log("Server is running on Port: " + port);
            return port;
        }

        return false;
    }


    // Listen on provided port, on all network interfaces.
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);


    // Event listener for HTTP server "error" event.
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string' ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    // Event listener for HTTP server "listening" event.
    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string' ? 'pipe ' + addr
            : 'port ' + addr.port;
        debug('Listening on ' + bind);
    }

    return server
};


module.exports = neServer;