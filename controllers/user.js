
/*
 * GET users listing.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.signin = function (req, res) {}

exports.signup = function(req, res){
  res.render('signup');
};

exports.logout = function(req, res){
	req.logout()
	res.redirect('/')
}

exports.doSignup = function(req, res){
	var error = ''
	if(req.param('username')===''||req.param('email')===''||req.param('password')===''||req.param('password2')==='')
	{
		error='Please fill in all fields';
	}
	else if(req.param('password')!==req.param('password2'))
	{
		error='Password mismatch';
	}
	// todo: check if user / email already exists


	var user = new User(req.body)
	user.provider = 'local'
	user.save(function (err) {
	if (err) {
	  return res.render('signup', {
	    // errors: utils.errors(err.errors),
	    user: user
	  })
	}
	req.login(user, function(err){
			if(err) return next(err)
			return res.redirect('/')
		})
	})

};

exports.login = function(req, res){
  res.render('login');
};

exports.doLogin = function(req, res){
	res.redirect('/')

};


exports.user = function (req, res, next, id) {
	console.log('asdfasdfasdf')
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
