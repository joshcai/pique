
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var fs = require('fs');

var http = require('http');
var path = require('path');

var env = process.env.NODE_ENV || 'dev';
var config = require('./config/config')[env];
var mongoose = require('mongoose');

mongoose.connect(config.db);

var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

require('./config/passport')(passport, config)

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('less-middleware')({dest: __dirname + '/public/css',
        src: __dirname + '/src/less',
        prefix: '/css'}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');


app.use(express.session({
	secret: 'thisisasecret',
	store: new mongoStore({
		url: config.db,
		collection : 'sessions'
	})
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(app.router);

require('./config/routes')(app, passport)



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
