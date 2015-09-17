# Node Engine 

A simple Tool to setup the basic foundation of a NodeJS app FAST

See the sample server file to see how easy it is

https://github.com/node-engine/ne-server/blob/master/sample-server.js

## Sample Development Config File

This is a sample config.json file 


```json

{
  "globals": {
    "APPNAME": "App Name",
    "SITENAME": "App Description",
  },
  "env": {
    "NODE_ENV"         : "development",
    "PORT"             : 3001,
    "MONGO_URL"        : "mongodb://username:password@domain.com:27001/databasename",
    "ROOTURL"          : "http://localhost:3001"
  }
}

``` 

## Sample Server Setup File

```js

#!/usr/bin/env node

var nodeEngine = require('node-engine-core');
var configDevelopment = require('../config.json');
var configProduction = require('../pm2.json');
var path = require('path');
var express = require('express');


////////////////////////
// Create the Server
////////////////////////


var currentEnv = process.env.NODE_ENV || 'development';
console.log("Current Environment: " + currentEnv);

var server = nodeEngine.init(currentEnv, configDevelopment, configProduction);

var config = server.locals.config;


/////////////////////////
// View Engine Setup
/////////////////////////


//////////////////////
// Static Assets
//////////////////////

var cacheTime = 100;
//nodeEngine.static(server, cacheTime);

server.use(express.static('media',{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/static'),{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/universal/css'),{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/universal/js'),{ maxAge: cacheTime }));


///////////////
// Routes
///////////////

// Setup the routes for the API
server.use('/api/people', require('./restapi/people'));

// Setup the routes for the Page Metadata
server.use('/api/page', require('./restapi/page'));

// Setup the routes for the Page Metadata
server.use('/api/emails', require('./restapi/emails'));

// Setup the redirect to the react router
server.use('/', require('./server/redirect'));


```


