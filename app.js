var gpio = require("pi-gpio");
var irc = require('twitch-irc');

var pin = 7;
var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
    channels: ['MarriedGaming']
}
var client = new irc.client(clientOptions);
client.connect();
 
gpio.open(pin, "output", function(err) {     // Open pin 16 for output 
    client.addListener('chat', function (channel, user, message) {
        console.log(user.username + ': ' + message);
        turnOn();
    });
});

function turnOn() {
    gpio.write(pin, 1, function() {          // Set pin 16 high (1) 
        setTimeout(turnOff, 3000);
    });
}
function turnOff() {
    gpio.write(pin, 0);
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