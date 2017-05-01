var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var connect = require('./database/connect');

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

var themeSettings;

connect(function(err, connection) {
    if (err) {
        console.log("Error connecting to the database");
        throw err;
    }
    else {
        console.log("Connected to the DB");

        connection.query({sql: 'SELECT * FROM settings ORDER BY id DESC', timeout: 60000},[],function(err, results, fields) {
            connection.release();
            // console.log('Query returned1 ' + JSON.stringify(results[0]));

            if(err) {
                throw err;
            }
            // no settings found
            else if (results.length === 0) {
                console.log("Settings not found");
            }
            // settings found
            else {
                console.log("Settings found");

                themeSettings = results[0];

            }
        });
    }
});

var currentThemeSettings = function(req, res, next) {
    if (!req.session.themeSettings) {
        req.session.themeSettings = themeSettings;
    }
    next();
};

app.use(currentThemeSettings);

app.use(function (req, res, next) {
    res.locals = {
        access: req.session.user,
        owner: req.session.admin,
        avatar: req.session.avatar,
        themeSettings: themeSettings = req.session.themeSettings
    };
    next();
});

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
        access: req.session.user,
        owner: req.session.admin
    });
});

module.exports = app;
