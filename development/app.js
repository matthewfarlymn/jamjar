var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*
 * To use sessions we need to require the following node package. 
 * See https://github.com/expressjs/session for more information
 */
var session = require('express-session');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/*
 * Next we need to set up express-session. First we create a js object to
 * store all the setup options (read https://github.com/expressjs/session
 * for details).
 * 
 * cookie.maxAge is the number of milliSeconds in which the cookie should
 * expire after when the cookie is created. If you don't specify a value
 * then the cookie gets destroyed when the browser is shutdown.
 * 
 * secret is a string used to sign the cookie using HMAC read all
 * about it here https://en.wikipedia.org/wiki/Hash-based_message_authentication_code
 * 
 * resave determines whether the session object should be resaved back to
 * the "session store" even if the session wasn't modified during the request. 
 * Session objects can be stored in what is know as a "session store". By default
 * this is simply computer memory but can be a database.
 * 
 * saveUninitialized, when true, causes a new but unmodified session object to be
 * saved to the session store. It is recommended that this is set to false.
 *   
 */

var expressSessionOptions = {
  cookie : {
      maxAge: 1000*60 
  },
  secret:'mySecret',
  resave: false,
  saveUninitialized: false
}

// Now set it up so that the session middleware is used on all requests
app.use(session(expressSessionOptions));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
