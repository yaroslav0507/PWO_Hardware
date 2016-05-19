const five = require('johnny-five');
const raspi = require('raspi-io');

var board = new five.Board({
    io: new raspi()
});

function servo(socket){
    var servo;

    var boardReady = new Promise(function(resolve, reject) {
        board.on("ready", function () {
            servo = new five.Servo('P1-12');
            resolve(servo);
        });
    });

    return boardReady;
}

module.exports = servo;
