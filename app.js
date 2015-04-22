var gpio = require("pi-gpio");

var pin = 7;
 
gpio.open(pin, "output", function(err) {     // Open pin 16 for output 
    turnOn();
});

function turnOn() {
    gpio.write(pin, 1, function() {          // Set pin 16 high (1) 
        setTimeout(turnOff, 1000);
    });
}
function turnOff() {
    gpio.write(pin, 0, function() {          // Set pin 16 high (1) 
        setTimeout(turnOn, 1000);
    });
}

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    gpio.close(7);
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));