'use strict';

function config(server){
    global.io = require('socket.io')(server);

    const deviceServo = require('./devices/servo');

    io.on('connection', function(socket) {
        var sensorData;
        const sensor = require('./devices/dht-sensor')();

        function measureTempAndHumidity() {
            sensorData = sensor.read();
            io.emit('DHT_SENSOR_DATA', sensorData);

            deviceServo(socket, function(servo) {
                if(sensorData.humidity > process.env.CRITICAL_HUMIDITY){
                    servo.min();
                    servo.max()
                } else {
                    servo.stop();
                }
            });
        }
        setInterval(measureTempAndHumidity, process.env.DHT_SENSOR_FREQUENCY);

    });
}

module.exports = config;
