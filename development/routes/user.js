var express = require('express');
var router = express.Router();
var connect = require('../database/connect');

/* GET home page */
router.get('/', function(req, res, next) {

  var msg = req.session.msg ? req.session.msg : "";
  var email = req.session.email ? req.session.email : "";

  req.session.msg = "";
  req.session.email = "";

  res.render('/', {
    msg: msg,
    email: email
  });
});


router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});


router.post('/sign-in', function(req, res, next) {

  console.log("sign-in");

  var email = req.body.email;
  var password = req.body.password1;

  // pool.connect(function(err, connection) {
  connect(function(err, connection) {
    if (err) {
      console.log("Error connecting to the database");
      throw err;
    }

    console.log("Connected to the DB");

    connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
      connection.release();

      console.log('Query returned ' + JSON.stringify(results));

      if(err) {
        throw err;
      }
      // successful login - id and password match
      else if ((results.length !== 0) && (password === results[0].password)) {
        console.log("Login successful!" + email);
        req.session.email = email;
        req.session.id = results.id;

        res.redirect('/');
      }
      // fail login - email not found
      else if ((results.length === 0) && (email.trim().length !== 0)) {
        console.log("Email not found.");
        req.session.msg = "Email is not registered.";
        res.redirect('/');
      }
      // fail login - email not entered
      else if (email.trim().length === 0) {
        console.log("No email entered.");
        req.session.msg = "Please enter email.";
        res.redirect('/');
      }
      // fail login - password not entered
      else if (password.trim().length === 0) {
        console.log("No password entered.");
        req.session.msg = "Please enter password.";
        req.session.email = email;
        res.redirect('/');
      }
      // fail login - password does not match
      else if ((results.length !== 0) && (password !== results[0].password)) {
        console.log("Incorrect password.");
        req.session.msg = "Password incorrect.";
        req.session.email = email;
        res.redirect('/');
      }
      // fail login - email does not exist
      else  {
        console.log("Email not registered.");
        req.session.msg = email + " does not exist. Please register.";
        res.redirect('/');
      }
    });
  });
});



router.post('/register', function(req,res, next) {

  console.log("register");

  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password1 = req.body.password1;
  var password2 = req.body.password2;

  console.log(email);
  console.log(firstName);
  console.log(lastName);
  console.log(password1);
  console.log(password2);


  // var pool = req.app.get('dbPool');

  // pool.connect(function(err, connection) {
  connect(function(err, connection) {
    if (err) {
      console.log("Error connecting to the database");
      throw err;
    }

    console.log("Connected to the DB");

    connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
      connection.release();

      console.log('Query returned ' + JSON.stringify(results));

      if(err) {
        throw err;
      }
      // fail - email exists
      else if (results.length !== 0) {
        console.log("Email already exists.");
        req.session.msg = "Email alreday registered.";
        req.session.email = email;
        req.session.firstName = firstName;
        req.session.lastName = lastName;
        // req.session.password1 = password1;
        // req.session.password2 = password2;
        console.log(email);
        res.redirect('/sign-in');
      }

      else if (results.length === 0) {
        // fail - email not entered
        if (email.trim().length === 0) {
          console.log("Email field empty.");
          req.session.msg = "Please enter email.";
          req.session.firstName = firstName;
          req.session.lastName = lastName;
          // lastNamereq.session.password1 = password1;
          // lastNamereq.session.password2 = password2;
          res.redirect('/sign-in');
        }
        // fail - firstName not entered
        else if (firstName.trim().length === 0) {
          console.log("firstName field empty.");
          req.session.msg = "Please enter first name.";
          req.session.email = email;
          req.session.lastName = lastName;
          // lastNamereq.session.password1 = password1;
          // lastNamereq.session.password2 = password2;
          res.redirect('/sign-in');
        }
        // fail - lastName not entered
        else if (lastName.trim().length === 0) {
          console.log("lastName field empty.");
          req.session.msg = "Please enter last name.";
          req.session.email = email;
          req.session.firstName = firstName;
          // lastNamereq.session.password1 = password1;
          // lastNamereq.session.password2 = password2;
          res.redirect('/sign-in');
        }
        // fail - password not entered
        else if (password1.trim().length === 0) {
          console.log("Password field empty.");
          req.session.msg = "Please enter password.";
          req.session.email = email;
          req.session.firstName = firstName;
          req.session.lastName = lastName;
          // lastNamereq.session.password2 = password2;
          res.redirect('/sign-in');
        }
        // fail - confirm password not entered
        else if (password2.trim().length === 0) {
          console.log("Re-enter Password field empty.");
          req.session.msg = "Please enter Re-enter password.";
          req.session.email = email;
          req.session.firstName = firstName;
          req.session.lastName = lastName;
          // lastNamereq.session.password1 = password1;
          res.redirect('/sign-in');
        }
        // fail - password and confirm password do not match
        else if (password1.trim() !== password2.trim()) {
          console.log("Confirm field empty.");
          req.session.msg = "Password fields do not match. Please re-enter.";
          req.session.email = email;
          req.session.firstName = firstName;
          req.session.lastName = lastName;
          // req.session.password = '';
          // req.session.confirm = '';
          res.redirect('/sign-in');
        }
        else {

          connect(function(err, connection) {
            if (err) {
              console.log("Error connecting to the database");
              throw err;
            }

            console.log("Connected to the DB");

            connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?,?,?,?)',[firstName, lastName, email, password], function(err, results, fields) {
              connection.release();

              console.log("Register and login successful. " + username);
              req.session.email = email;
              // req.session.userID = results.userId;
              res.redirect('/sign-in');
            });
          });
        }
      }
    });
  });
});

module.exports = router;
