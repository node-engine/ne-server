#!/usr/bin/env node

////////////////////////
// Create the Server
////////////////////////

var nodeEngineServer = require('ne-server');
var server = nodeEngineServer.init(process.env.PORT);

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);


//////////////////////
// Static Assets
//////////////////////

var dirName = __dirname;
var cacheTime = 100;

nodeEngineServer.static(server, dirName, cacheTime);


///////////////
// REST API
///////////////

var mongoRest = require('ne-mongo-rest');

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
var appmeta = require ('./appmeta');
var routes = require ('./routes');

neRender.serverRender(server, appmeta, routes);