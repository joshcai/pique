var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Answer = mongoose.model('Answer');

module.exports = function(io, mongoSessionStore){
	var parseCookie = require('connect').utils.parseSignedCookie;
	var cookie = require('express/node_modules/cookie');
  
	io.set('authorization', function (data, accept) {
	    // check if there's a cookie header
	    if (data.headers.cookie) {
	        // if there is, parse the cookie
	        data.cookie = cookie.parse(data.headers.cookie);
	        // note that you will need to use the same key to grad the
	        // session id, as you specified in the Express setup.
	        data.sessionId = parseCookie(data.cookie['connect.sid'], 'thisisasecret');
	    } else {
	       // if there isn't, turn down the connection with a message
	       // and leave the function.
	       return accept('No cookie transmitted.', false);
	    }
	    // accept the incoming connection
	    accept(null, true);
	});

	io.sockets.on('connection', function (socket) {
		var sessionStore = mongoSessionStore;
		var sessionId = socket.handshake.sessionId;

		// send session data to user on connection	
		sessionStore.get(sessionId, function(err, session){
			if(!err){
				console.log(session)
				if(session.passport.user){
					socket.emit('sessiondata', {user: session.passport.user})
				}
			}
		})

		socket.on('answer', function (data) {
			// Answer.findOne({ '_id': data.answer_id}, function(err, answer){

			// })
			Question.findOne({ '_id': data.question_id}, function(err, question){
				console.log(question);
			})
			console.log(data);
		});
		
	});

	// app.io.route('ready', function(req){
	// 	console.log(req)
	// 	req.session.user = req.user;
	// 	req.session.save(function(){
	// 		req.io.emit('sessiondata', req.session)
	// 	})
	// 	console.log('please');
	// })
	// app.io.route('answer', function(req){
	// 	console.log(req.data)
	// })

}
