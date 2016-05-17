'use strict';

//Mini Digital Temperature and Humidity Sensor
var dht = require('node-dht-sensor');

function dhtSensor() {
    var sensor = {
	data: {},
	initialize: function () {
	    return dht.initialize(22, 4);
	},
	read: function () {
	    var readout = dht.read();
	    sensor.data = {
		temperature: readout.temperature.toFixed(2) + 'C',
		humidity: readout.humidity.toFixed(2) + '%'
	    };

	    console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +
		'humidity: ' + readout.humidity.toFixed(2) + '%');
	    return sensor.data;
	}
    };

    if (sensor.initialize()) {
	sensor.read();
    } else {
	console.warn('Failed to initialize sensor');
    }

    return sensor;
}

module.exports = dhtSensor;



