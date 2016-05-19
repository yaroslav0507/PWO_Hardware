'use strict';
function led(){
    var five = require("johnny-five");
    var board = new five.Board();

    board.on("ready", function() {
	var led = new five.Led(13);
	led.blink();
    });
}

module.exports = led;