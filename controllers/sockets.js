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

			Question.findOne({ '_id': data.question_id}, function(err, question){
				// if user hasn't answered this question
				if(question.answered.indexOf(data.user_id) == -1)
				{
					question.answered.push(data.user_id)
					question.save(function(err){
						if(err)
						{

						}
						Answer.findOne({ '_id': data.answer_id}, function(err, answer){
							answer.answered.push(data.user_id)
							answer.save(function(err)
							{
								if(err)
								{

								}
								var query = Question.findOne({ '_id': question._id})
								.populate('authorId', 'username')
								.populate('answers')
								query.exec(function(err, question_return){
									var options = {
										path: 'answers.answered',
										select: 'username',
										model: 'User'
									}
									if(err) return res.json(500);
									Question.populate(question_return, options, function(err, question_return){
										socket.emit("answer_return", question_return);
										User.findOne({'_id': data.user_id}, function(err, user){
											socket.broadcast.emit('answer_append', {question: question_return._id,
																					answer: answer._id,
																					username: user.username
																					})
										})
									})
								})
							})
						})
					})

				}
				
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
