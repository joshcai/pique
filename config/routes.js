var routes = require('../routes/application');
var user = require('../routes/user');

module.exports = function(app, passport){
	app.get('/', routes.index);
	app.get('/signup', user.signup);
	app.post('/signup', user.doSignup);
	app.get('/login', user.login);
	app.post('/login', user.doLogin);
}