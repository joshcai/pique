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
		var options = {
			path: 'answers.answered',
			select: 'username',
			model: 'User'
		}
		if(err) return res.json(500);
		Question.populate(questions, options, function(err, questions){
			res.render('index', { title: 'Express', questions: questions, fs:{
				inAnswers: function(answered, id){
				 	for(var i=0; i<answered.length; i++)
				 	{
						if(new String(answered[i]._id).valueOf() === new String(id).valueOf()) return true;
					}
				 	return false;
				}
			}});
		})
	})


};
