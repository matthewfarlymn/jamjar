var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var session = require('express-session');

var index = require('./routes/index');

var app = express();

var mysql = require('mysql');

var connection;

function connectToDB() {
  // Create a connection by calling createConnection and pass it a JSON object with
  // all the neccessary information.
  connection = mysql.createConnection({
   host : 'localhost',
   user : 'root',
   password : 'root',
   database : 'jamjar',
   charset : 'utf8',
   port : 3306,
   socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
 });

  // connect to the DB, the calling back function gets called once the connection
  // has been made (or not)
  connection.connect(function(err) {
    if (err) {
      console.log('Error connecting to DB: ', err);
      // If we experienced a problem when connection to the DB then
      // back off fro 2000 ms and try again. To try again we call this function
      // again, hence the reason we have put all of this code it its own function
      setTimeout(connectToDB, 2000);
    }
  });

  // If we receive an error event handle it
  connection.on('error', function(err) {
    console.log('Got a DB Error: ', err);
    /**
     * If we have lost a connection to the DB, ,maybe we are restarting it, then
     * try and reconnect, otherwise throw an exception
     */
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectToDB();
    } else {
      throw err;
    }
  });
}

// Call the connectToDB function
connectToDB();


// connection.connect();
//
// var userIns = {
//   userName: 'Fido2',
//   userPassword: 'password'
// };

// var query = connection.query('INSERT INTO user SET ?', userIns, function(err, result) {
//
// });

// console.log(query.sql);

// connection.query('SELECT * FROM user', function(err, rows, fields)
// {
//   if (err) {
//     throw err;
//   }
//
//   // for (var i=0; i<rows.length; i++) {
//   //   console.log(rows[i]);
//   // }
//
// });

// connection.end();

app.set('dbConnection', connection);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Express Session */

var expressSessionOptions = {
  secret:'mySecret',
  resave: false,
  saveUninitialized: false
};

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

app.get('/register', function (req, res) {
  res.render('register', {
      title: 'Register',
      twitterDetails: req.session.twitterDetails
    }
  );
});

app.post('/register', function (req, res, next) {
  // Generic validation
  req.assert('fname', 'First name is empty').notEmpty();
  req.assert('lname', 'Last name is empty').notEmpty();
  req.assert('street1', 'Street address is empty').notEmpty();
  req.assert('city', 'City is empty').notEmpty();
  req.assert('county', 'County is empty').notEmpty();
  req.assert('postcode', 'Post code is empty').notEmpty();
  req.assert('phone', 'Phone is empty').notEmpty();
  // Email validation
  req.assert('email', 'Email is invalid.').isEmail();
  req.assert('email', 'Email field is empty').notEmpty();
  // Password validation
  req.assert('password', 'Password too short. Must be 8 characters or more.').len(8);
  req.assert('password', 'Passwords do not match.').is(req.body.confirm);
  req.assert('password', 'Password field is empty').notEmpty();
  req.assert('confirm', 'Confirm password field is empty').notEmpty();
  var errors = req.validationErrors(true);
  if (errors) {
    console.log(errors);
    // What do to if there are errors?
  }
  // If there are no errors, continue handling the form…
});


module.exports = app;
