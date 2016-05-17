'use strict';

const express         = require('express');
const app             = express(),
      server          = require('http').Server(app),
      path            = require('path');

require('dotenv').load();
require('./api/config')(server);

app.use(express.static(path.join(__dirname, './client')));

server.listen(process.env.SERVER_PORT, function(){
    console.log('Express server listening on port: ' + process.env.SERVER_PORT);
});