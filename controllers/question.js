
/*
 * GET users listing.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Question = mongoose.model('Question');
var Answer = mongoose.model('Answer');


exports.ask = function(req, res){
  res.render('ask');
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
		return res.redirect('/')
	})

};


