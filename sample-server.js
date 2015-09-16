#!/usr/bin/env node

var nodeEngine = require('node-engine-core');
var data = require('../pm2.json');

var path = require('path');
var express = require('express');

////////////////////////
// Create the Server  //
////////////////////////

var server = nodeEngine.init();

//////////////////////////
// Set the Environment  //
//////////////////////////

var currentEnv = process.env.NODE_ENV || 'development';

///////////////////
//    MongoDB    //
///////////////////

var developmentMongoUrl = data.env.MONGO_URL;
nodeEngine.mongo(server, developmentMongoUrl, currentEnv);
// In production it wil use the MONGO_URL from the environment variables

///////////////////
// React Engine  //
///////////////////

// For using react as the view engine for express
// This is not really needed but can be useful sometimes
nodeEngine.reactViews(server);


////////////////////
// Static Assets  //
////////////////////

var cacheTime = 100;
//nodeEngine.static(server, cacheTime);

server.use(express.static('media',{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/static'),{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/universal/css'),{ maxAge: cacheTime }));
server.use(express.static(path.join(__dirname, '/universal/js'),{ maxAge: cacheTime }));


/////////////
// Routes  //
/////////////

// Setup the routes for the API
server.use('/api/people', require('./restapi/people'));

// Setup the routes for the Page Metadata
server.use('/api/page', require('./restapi/page'));

// Setup the routes for the Page Metadata
server.use('/api/emails', require('./restapi/emails'));

// Setup the redirect to the react router
server.use('/', require('./server/redirect'));


/////////////////////////
// Server Boilerplate  //
/////////////////////////


nodeEngine.serverSetup(server, data);

