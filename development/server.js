var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');

var index = require('./routes/index');
var user = require('./routes/user');
var admin = require('./routes/admin');

var app = express();

app.locals.moment = require('moment');

// Setup express-sessions
var sessionOptions = {
    secret:'rajmaj',
    resave: false,
    saveUninitialized: false
};

app.use(session(sessionOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

var access = function(req, res, next) {
    if (!req.session.user) {
        res.redirect('/sign-in');
    } else {
        next();
    }
};

var owner = function(req, res, next) {
    if (!req.session.admin) {
        res.redirect('/sign-in');
    } else {
        next();
    }
};

app.use('/user', access);
app.use('/user', user);
app.use('/admin', owner);
app.use('/admin', admin);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Page Not Found');
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
    res.render('error', {
        access: req.session.user
    });
});

module.exports = app;
