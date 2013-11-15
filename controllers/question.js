
/*
 * GET users listing.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Answer = mongoose.model('Answer');


exports.ask = function(req, res){
	var query = User.findOne({'_id':req.user._id})
			.populate('following', 'username')
			// .sort({'created': -1})
	query.exec(function(err, user){
	  res.render('ask', {'user': user});
	})
};

exports.doAsk = function(req, res){

	var question = new Question(req.body)
	question.authorId = req.user.id
	for(var key in req.body.answer){
		var ans = new Answer({answer: req.body.answer[key]})
		ans.save(function(err){
			if(err){
				//handle error
			}
		})
		question.answers.push(ans)
	}
	question.save(function (err) {
		if (err) {
		  return res.render('ask', {
		    // errors: utils.errors(err.errors),
		    question: question
		  })
		}
		req.flash('first', 'true')
		return res.redirect('/question/'+question._id)
	})

};

exports.display = function(req, res){
	var id = req.params.id;
	var query = Question.findOne({'_id': id})
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
			res.render('question', { title: 'Express', question: questions, first: req.flash('first')})
		})
	})

}


