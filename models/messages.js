var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
    },
    at: {
		type : Date,
		default : Date.now
    },
	message: {
		type: String
	}
});

var Message = module.exports = mongoose.model('Message', MessageSchema);

module.exports.addMessage = function(newMessage, callback){
	newMessage.save(callback);
};

module.exports.getPrevious = function(lim, callback){
	// Message.find().sort({at: -1}).limit(lim).toArray(callback);
	Message.find().sort({at: -1}).limit(lim).exec(callback);
		// function(err, data){
		// callback(err, data.toJSON());
	// });
};