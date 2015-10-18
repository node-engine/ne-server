var express = require('express');
var debug = require('debug')('express:server');
var path = require('path');
var bodyParser = require("body-parser");
var fs = require("fs");

var neServer = {};

neServer.init = function(PORT){

    var currentEnv = process.env.NODE_ENV || 'development';
    console.log("Current Environment: " + currentEnv);

    var server = express();

    if (process.env.PORT) {
        console.log("Using port from process.env.PORT");
        var port = normalizePort(process.env.PORT);
    }

    else if (!process.env.PORT){
        console.log("No process.env.PORT found");
        console.log("Looking for a PORT");

        if (PORT) {
            console.log("Found PORT");
            console.log("Using port from PORT");
            var port = normalizePort(PORT);
        }

        else {
            console.log("No PORT found");
            console.log("Using default port");
            var port = normalizePort('3000');
        }

    }

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


neServer.auto = function(server, dirName, serverOptions, appmeta, routes, dataRef){

    ////////////////////////
    // for the rest API post, put requests
    ////////////////////////

    server.use(bodyParser.json());
    server.use(bodyParser.raw());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.text());

    ////////////////////////
    // Logging
    ////////////////////////

    // Logs every transaction to the console
    var morgan = require('morgan');
    server.use(morgan('dev'));


    //////////////////////
    // Static Assets
    //////////////////////

    var cacheTime = serverOptions.cacheTime
    this.static(server, dirName, cacheTime);

    ///////////////
    // Mongo
    ///////////////

    var mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_URL);


    ///////////////
    // Cookies
    ///////////////

    var cookieParser = require('cookie-parser');
    // Parse the cookies in the headers and set it as the req.cookies variable
    server.use(cookieParser());


    ///////////////
    // neAuth
    ///////////////

    // Import passport
    var passport = require ('passport');
    var neAuth = require ('ne-auth');

    // Configure additional passport here strategies before init
    neAuth.config(passport);

    // Initialize passport
    neAuth.init(server, passport);

    // Setup the routes

    neAuth.routes(server, passport, serverOptions);
    // If usersDetail is set to true you must define a user details models with the name of 'neuserdetail'
    // If insecure is set to true then all users can edit users
    // Now you can use passport configure additional routes here


    ///////////////
    // Content API
    ///////////////

    var neData = require('ne-data');
    neData.routesConfig(server, dirName);


    //////////////////////
    // Routes
    //////////////////////

    // Must be after auth
    this.routes(server, dirName);


    ////////////////////////////////////////////////////////////
    // Rendering React with React-Router on the server with Pre-Render Data from API's
    ////////////////////////////////////////////////////////////

    var neRender = require('ne-render');
    neRender.serverRender(server, appmeta, routes, dataRef);


    ////////////////////////////////////////////////////////////
    // ne-auth custom error handling
    ////////////////////////////////////////////////////////////

    server.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            res.redirect('/login?message=AccessDenied:InsufficientPermissions').status(401);
        }
    });
}

neServer.static = function (server, dirName, cacheTime){

    server.use(express.static('media',{ maxAge: cacheTime }));
    server.use(express.static(path.join(dirName, '/static'),{ maxAge: cacheTime }));
    server.use(express.static(path.join(dirName, '/css'),{ maxAge: cacheTime }));
    server.use(express.static(path.join(dirName, '/js'),{ maxAge: cacheTime }));

};

neServer.routes = function(server, dirName){

    //Configure routes
    var dirToRead = dirName + "/routes";

    fs.readdirSync(dirToRead).forEach(function(filename) {

        var requirePath = "../../app/routes/" + filename;

        console.log('neServer: custom route requirePath');
        console.log(requirePath);

        var setupRoutes = require(requirePath);
        setupRoutes(server);

    });
}


module.exports = neServer;