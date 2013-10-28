
var UserProvider = require('../userprovider').UserProvider;

var userProvider = new UserProvider('localhost', 27017);

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.signup = function(req, res){
  res.render('signup');
};

exports.doSignup = function(req, res){
	var error = ''
	if(req.param('username')===''||req.param('email')===''||req.param('password')===''||req.param('password2')==='')
	{
		error='Please fill in all fields';
	}
	else if(req.param('password')!==req.param('password2'))
	{
		error='Password mistmatch';
	}
	// todo: check if user / email already exists

	if(error==='')
	{
		userProvider.save({
			username: req.param('username'),
			email: req.param('email'),
			password: req.param('password')
		}, function(error, docs){
			  res.redirect('/');
		});
	}
	else
	{
		res.render('signup',{
			username: req.param('username'),
			email: req.param('email'),
			error: error
		});
	}

};

exports.login = function(req, res){
  res.render('login');
};

exports.doLogin = function(req, res){
	var error = ''
	userProvider.findById
	if(req.param('username')===''||req.param('email')===''||req.param('password')===''||req.param('password2')==='')
	{
		error='Please fill in all fields';
	}
	else if(req.param('password')!==req.param('password2'))
	{
		error='Password mistmatch';
	}
	// todo: check if user / email already exists

	if(error==='')
	{
		userProvider.save({
			username: req.param('username'),
			email: req.param('email'),
			password: req.param('password')
		}, function(error, docs){
			  res.redirect('/');
		});
	}
	else
	{
		res.render('signup',{
			username: req.param('username'),
			email: req.param('email'),
			error: error
		});
	}

};