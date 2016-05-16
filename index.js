'use strict';

const express         = require('express');
const app             = express(),
      server          = require('http').Server(app),
      path            = require('path');

const routes 	      = require('./routes/index');

app.use('/', routes);
app.use(express.static(path.join(__dirname, './client')));

server.listen(4000, function(){
    console.log('Express server listening on port: ' + 4000);
});