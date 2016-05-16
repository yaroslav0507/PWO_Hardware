const five = require('johnny-five');
const raspi = require('raspi-io');

function servo(server){
    const io  = require('socket.io')(server);

    var servo;
    var board = new five.Board({
        io: new raspi()
    });

    board.on("ready", function () {
        servo = new five.Servo('P1-12');
        servo.min();
        servo.max();
    });

    io.on('connection', function(socket) {
        socket.on('start.servo', function(deg) {
            servo.to(deg);
        });
    });
}

module.exports = servo;
