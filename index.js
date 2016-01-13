var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('../socket.io')(http);

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Counter for disconnect
var count = 0;

io.on('connection', function(socket) {
	count++;

	// Welcome the user
	if(count === 1) {
		socket.emit('welcome', 'Welcome to chatroom, you are the first to arrive here.');
	} else if(count === 2){
		socket.emit('welcome', 'Welcome to chatroom, there is another person is the room.');
	} else {
		socket.emit('welcome', 'Welcome to chatroom, there are ' + (count - 1) + ' other people is the room.');
	}

	// Broadcasting means sending a message to everyone else except for the socket that starts it.
	socket.broadcast.emit('connected', {
		number: count
	});
    console.log('new user connected');
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
        count--;
        io.sockets.emit('disconnected', {
            number: count
        });
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
