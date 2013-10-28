var routes = require('../controllers/application');
var user = require('../controllers/user');

module.exports = function(app, passport){

	app.param('', user.user)

	app.get('/', routes.index);
	app.get('/signup', user.signup);
	app.post('/signup', user.doSignup);
	app.get('/login', user.login);
	app.get('/logout', user.logout);
	app.post('/login',
		passport.authenticate('local',{
			failureRedirect: '/login',
			failureFlash: 'Invalid username or password. '
		}), user.doLogin);
	app.get('/auth/facebook',
		passport.authenticate('facebook', {
		  	scope: [ 'email', 'user_about_me'],
		  failureRedirect: '/login'
		}), user.signin)
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
		  	failureRedirect: '/login'
		}), user.doLogin)	
}
