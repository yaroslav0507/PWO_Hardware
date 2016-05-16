'use strict';

function config(server){
    require('./devices/servo')(server);
}

module.exports = config;
