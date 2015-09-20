#!/usr/bin/env node

////////////////////////
// Config
////////////////////////

var configDevelopment = require('../config/config.json');
var configProduction = require('../config/pm2.json');

var currentEnv = process.env.NODE_ENV || 'development';
console.log("Current Environment: " + currentEnv);

if ('development' == currentEnv) {
    var config = configDevelopment;
    console.log('Using Development CONFIG');
}

if ('production' == currentEnv) {
    var config = configProduction;
    console.log('Using Production CONFIG');
}


////////////////////////
// Create the Server
////////////////////////

var nodeEngineServer = require('ne-server');

var server = nodeEngineServer.init(config);


/////////////////////////
// View Engine Setup
/////////////////////////

// Optional not necessary





//////////////////////
// Static Assets
//////////////////////


var express = require('express');

var path = require('path');

var cacheTime = 100;
// future feature
// nodeEngine.static(server, cacheTime);
// send the __dirname to the function

server.use(express.static('media',{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/static'),{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/universal/css'),{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/universal/js'),{ maxAge: cacheTime }));

///////////////
// REST API
///////////////

var mongoRest = require('ne-mongo-rest');

var dirName = __dirname;
var apiPath = "/api";
mongoRest.server(server, dirName, apiPath);


//////////////////////////////
// Express Test
//////////////////////////////

server.use('/express', require('./server/express'));



////////////////////////////////////////////////////////////
// Rendering React with React-Router on the server with Pre-Render Data from API's
////////////////////////////////////////////////////////////

var neRender = require('ne-render');
var appConfig = require ('./universal/appConfig');
var routes = require ('./universal/routes');

neRender.serverRender(server, appConfig, routes);