var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Answer = mongoose.model('Answer');



exports.index = function(req, res){
	var query = Question.find()
							.populate('authorId', 'username')
							.populate('answers')
							.sort({'created': -1})
	query.exec(function(err, questions){
		if(err)
		{

		}
		res.render('index', { title: 'Express', questions: questions});
	})


};
