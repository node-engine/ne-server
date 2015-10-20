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

    var cacheTime = serverOptions.cacheTime;
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