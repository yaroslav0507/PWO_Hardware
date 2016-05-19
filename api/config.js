'use strict';

function config(server) {
    global.io = require('socket.io')(server);

    var sensorData;
    const sensor = require('./devices/dht-sensor')();
    const deviceServo = require('./devices/servo')();
    require('./devices/led')();

    function measureTempAndHumidity() {
	sensorData = sensor.read();

	if (sensorData.humidity > process.env.CRITICAL_HUMIDITY) {
	    console.log("Exceeded critical level of humidity!");

	    deviceServo
		.then(function (servo) {
		    servo.min();

		    setTimeout(function () {
			servo.max();
		    }, 500)
		}, function () {
		    servo.stop();
		});
	}
    }
    setInterval(measureTempAndHumidity, process.env.DHT_SENSOR_FREQUENCY);

    io.on('connection', function (socket) {
	socket.on('start.servo', function(deg) {
	    deviceServo
		.then(function (servo) {
		    servo.to(deg);
		});
	});
	setInterval(function () {
	    sensorData ? socket.emit('DHT_SENSOR_DATA', sensorData) : null;
	}, process.env.DHT_SENSOR_FREQUENCY);
    });
}

module.exports = config;
