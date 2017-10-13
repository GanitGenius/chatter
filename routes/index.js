var express = require('express');
var router = express.Router();

var Message = require('../models/messages');

users = [];
connections = [];

// Get Homepage
router.get('/', function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next;
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

var socketio = function(io){
	io.sockets.on('connection', function(socket){
		connections.push(socket);
		console.log('Connected: %s users connected', connections.length);

		socket.on('disconnect', function(data){
			connections.splice(connections.indexOf(socket), 1);
			console.log('Disconnected: %s users connected', connections.length);
		});
		
		// Create function for send status
		sendStatus = function(s){
			socket.emit('status', s);
		}

		// Get chats from mongo collections
		Message.getPrevious(50, function(err, res){
			if(err){
				throw err;
			}
			// Emit the message
			socket.emit('output', res);
		});

		socket.on('send message', function(data){
			// console.log(data);
			io.sockets.emit('new message', {msg: data});
		});

		// Handle input events
		socket.on('input', function(data){
			var username = data.username;
			var message = data.message;
			
			if(username == '' || message == ''){
				console.log('input received with incomplete information');
			} else {
				// Insert message
				var newMessage = new Message({
					username : name,
					time : Date(),
					message : message
				});

				Message.addMessage(newMessage, function(){
					client.emit('output', [data]);

					// Send Status object
					sendStatus({
						message:'message sent',
						clear: true
					});
				});
			}
		});

		// Handle Clear
		// socket.on('clear', function(data){
		// 	// Remove all chats from collection
		// 	Message.clear({}, function(){
		// 		// Emit cleared
		// 		socket.emit('cleared');
		// 	});
		// });
	});
};


// module.exports = router;
module.exports = {router: router, socketio: socketio};
	