var express = require('express');
var debug = require('debug')('express:server');
var path = require('path');
var ReactEngine = require('react-engine');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cors = require('cors');

var nodeEngine = {};

nodeEngine.init = function(){
    return express()
};

nodeEngine.reactViews = function(server){

    // create an engine instance
    var engine = ReactEngine.server.create({
        reactRoutes:'./routes.jsx'
    });

    // view engine setup react engine
    server.engine('.js', engine);

    // set the view directory
    server.set('views', path.join(__dirname, '/app/universal/handlers'));

    // set jsx or js as the view engine
    // (without this you would need to supply the extension to res.render())
    // ex: res.render('index.jsx') instead of just res.render('index').
    server.set('view engine', 'js');

    // finally, set the custom view
    server.set('view', require('react-engine/lib/expressView'));

};

nodeEngine.serverSetup = function(server, data){

    // Get port from environment and store in Express.
    var port = normalizePort(process.env.PORT || data.env.PORT || '3000');
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

};

nodeEngine.mongo = function(server, developmentMongoUrl, currentEnv){

    // This is used for mongodb and the api stuff cross origin resource sharing
    server.use(cors());

    // for the rest API post, put requests
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.use(bodyParser.raw());
    server.use(bodyParser.text());

    if ('development' == currentEnv) {
        mongoose.connect(developmentMongoUrl);
    }

    if ('production' == currentEnv) {
        mongoose.connect(process.env.MONGO_URL);
    }
};

nodeEngine.static = function (server, cacheTime){

    server.use(express.static('media',{ maxAge: cacheTime }));
    server.use(express.static(path.join(__dirname, '/static'),{ maxAge: cacheTime }));
    server.use(express.static(path.join(__dirname, '/universal/css'),{ maxAge: cacheTime }));
    server.use(express.static(path.join(__dirname, '/universal/js'),{ maxAge: cacheTime }));

};

module.exports = nodeEngine;