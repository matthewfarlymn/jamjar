var express = require('express');
var router = express.Router();
var connect = require('../database/connect');


router.get('/', function(req, res, next) {

    var popularProducts = '';
    var recentProducts = '';

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT d.productsId, d.stock, p.id, p.title, p.description, p.image1 FROM products p INNER JOIN product_details d ON p.id = d.productsId ORDER BY d.stock',[],function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no products found
                else if (results.length === 0) {
                    console.log("No products found :(");
                }
                // products found
                else {
                    console.log("Products found :)");
                    popularProducts = results;

                    var obj = {};
                    for (var i=0; i < popularProducts.length; i++)
                        obj[popularProducts[i].title] = popularProducts[i];

                    for (var key in obj)
                        popularProducts.push(obj[key]);

                    popularProducts = popularProducts.slice(0,4);

                }
            });


            connection.query('SELECT * FROM products ORDER BY id DESC',[], function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    // no products found
                    else if (results.length === 0) {
                        console.log("No products found :(");
                    }
                    // products found
                    else {
                        console.log("Products found :)");
                        recentProducts = results.slice(0,4);
                    }
            });
        }

        connection.commit(function(err) {
          connection.release();
          if (err) {
            connection.rollback(function() {
              throw err;
            });
          }
          else {
            res.render('index', {
              access: req.session.email,
              popularProducts: popularProducts,
              recentProducts: recentProducts
            });
          }
        });
    });
});

router.get('/about', function(req, res, next) {
    res.render('about', {
        access: req.session.email
    });
});

router.get('/products', function(req, res, next) {

    var products = '';

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM products ORDER BY id DESC',[], function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                  throw err;
                }
                // no products found
                else if (results.length === 0) {
                  console.log("no products found :(");
                }
                // products found
                else {
                  console.log("products found :)");
                  products = results;
                }
          });
        }

        connection.commit(function(err) {
            connection.release();
            if (err) {
                connection.rollback(function() {
                    throw err;
                });
            }
            else {
                res.render('products', {
                    access: req.session.email,
                    products: products
                });
            }
        });
    });
});

router.get('/product/:id/:title', function(req, res, next) {

    var product = '';
    var details = '';
    var popularProducts = '';

    if (req.params.id) {

        connect(function(err, connection) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                console.log("Connected to the DB");

                connection.query('SELECT * FROM products WHERE id=? ',[req.params.id],function(err, results, fields) {
                    // console.log('Query returned ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    // no products found
                    else if (results.length === 0) {
                        console.log("Product not found");
                    }
                    // products found
                    else {
                        console.log(results[0].title + " product found");
                        product = results;

                        // for (var i=0; i<=4; i++) {
                        //     // var str1 = "results[0].image";
                        //     var result = this["results[0].image" + i];
                        //     console.log(result);
                        //
                        //     productImages[i] = result;
                        //     console.log(productImages[i]);
                        // }
                    }
                });
            }


            connection.query('SELECT * FROM product_details WHERE productsId=? AND status="enabled" ORDER BY price',[req.params.id],function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no products found
                else if (results.length === 0) {
                    console.log("Details not found");
                }
                // products found
                else {
                    console.log("Details product found");
                    details = results;
                    // console.log(results);
                }
            });


            connection.query('SELECT d.productsId, d.stock, p.id, p.title, p.description, p.image1 FROM products p INNER JOIN product_details d ON p.id = d.productsId ORDER BY d.stock',[],function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no products found
                else if (results.length === 0) {
                    console.log("no products found :(");
                }
                // products found
                else {
                    console.log("products found :)");
                    // popularProducts = results.slice(0,4);
                    popularProducts = results;

                    var obj = {};
                    for (var i=0; i < popularProducts.length; i++)
                        obj[popularProducts[i].title] = popularProducts[i];

                    for (var key in obj)
                        popularProducts.push(obj[key]);

                    popularProducts = popularProducts.slice(0,4);

                }
            });

            connection.commit(function(err) {
              connection.release();
              if (err) {
                connection.rollback(function() {
                    throw err;
                });
              }
                else {
                    res.render('product', {
                        access: req.session.email,
                        product: product,
                        details: details,
                        popularProducts: popularProducts
                    });
                }
            });
        });
    }
});

router.get('/contact', function(req, res, next) {
    res.render('contact', {
        access: req.session.email
    });
});

router.get('/sign-out', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/sign-in', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var userEmail = req.session.userEmail ? req.session.userEmail : "";
    var email = req.session.email ? req.session.email : "";
    var firstname = req.session.firstname ? req.session.firstname : "";
    var lastname = req.session.lastname ? req.session.lastname : "";

    req.session.msg = "";
    req.session.email = "";
    req.session.firstname = "";
    req.session.lastname = "";

  res.render('access', {
      errorMessage: msg,
      userEmail: userEmail,
      email: email,
      firstName: firstname,
      lastName: lastname,
    });
});

// sign-in user
router.post('/sign-in', function(req, res, next) {

  // console.log("sign-in");

  var email = req.body.email;
  var password = req.body.password;

  connect(function(err, connection) {
    if (err) {
      console.log("Error connecting to the database");
      throw err;
    }
    else {
      console.log("Connected to the DB");

      connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
        connection.release();
        // console.log('Query returned ' + JSON.stringify(results));

        if(err) {
          throw err;
        }
        // successful login - id and password match
        else if ((results.length !== 0) && (password === results[0].password)) {
          console.log("Login successful!" + email);
          req.session.email = email;
          res.redirect('/');
        }
        // fail login - email not entered
        else if (email.trim().length === 0) {
          console.log("No email entered.");
          req.session.msg = "Please enter email.";
          res.redirect('/sign-in');
        }
        // fail login - password not entered
        else if (password.trim().length === 0) {
          console.log("No password entered.");
          req.session.msg = "Please enter password.";
          req.session.userEmail = email;
          res.redirect('/sign-in');
        }
        // fail login - password does not match
        else if ((results.length !== 0) && (password !== results[0].password)) {
          console.log("Incorrect password.");
          req.session.msg = "Password incorrect.";
          req.session.userEmail = email;
          res.redirect('/sign-in');
        }
        // fail login - email not found
        else  {
          console.log("Email not found.");
          req.session.msg = email + " does not exist. Please register.";
          res.redirect('/sign-in');
        }
      });
    }
  });
});

// register user
router.post('/register', function(req, res, next) {

  // console.log("register");

  var email = req.body.email;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var password1 = req.body.password1;
  var password2 = req.body.password2;

  connect(function(err, connection) {
    if (err) {
      console.log("Error connecting to the database - query");
      throw err;
    }
    else {
      console.log("Connected to the DB - query");

      connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
        connection.release();
        // console.log('Query returned ' + JSON.stringify(results));

        if(err) {
          throw err;
        }
        // fail - email exists
        else if (results.length !== 0) {
          console.log("Email already exists.");

          console.log("Email already exists.");

          req.session.msg = "Email already in use.";
          req.session.email = email;
          req.session.firstname = firstName;
          req.session.lastname = lastName;
          res.redirect('/sign-in');
        }
        else if (results.length === 0) {
          // fail - email not entered
          if (email.trim().length === 0) {
            console.log("Email field empty.");
            req.session.msg = "Please enter email.";
            req.session.firstname = firstName;
            req.session.lastname = lastName;
            res.redirect('/sign-in');
          }
          // fail - firstName not entered
          else if (firstName.trim().length === 0) {
            console.log("firstName field empty.");
            req.session.msg = "Please enter firstname.";
            req.session.email = email;
            req.session.lastname = lastName;
            res.redirect('/sign-in');
          }
          // fail - lastName not entered
          else if (lastName.trim().length === 0) {
            console.log("lastName field empty.");
            req.session.msg = "Please enter lastname.";
            req.session.email = email;
            req.session.firstname = firstName;
            res.redirect('/sign-in');
          }
          // fail - password not entered
          else if (password1.trim().length === 0) {
            console.log("Password field empty.");
            req.session.msg = "Please enter password.";
            req.session.email = email;
            req.session.firstname = firstName;
            req.session.lastname = lastName;
            res.redirect('/sign-in');
          }
          // fail - confirm password not entered
          else if (password2.trim().length === 0) {
            console.log("Re-enter password field empty.");
            req.session.msg = "Please re-enter password.";
            req.session.email = email;
            req.session.firstname = firstName;
            req.session.lastname = lastName;
            res.redirect('/sign-in');
          }
          // fail - password and confirm password do not match
          else if (password1.trim() !== password2.trim()) {
            console.log("Confirm field empty.");
            req.session.msg = "Password fields do not match. Please try again.";
            req.session.email = email;
            req.session.firstname = firstName;
            req.session.lastname = lastName;
            res.redirect('/sign-in');
          }
          else {

            connect(function(err, connection) {
              if (err) {
                console.log("Error connecting to the database");
                throw err;
              }
              else {
                console.log("Connected to the DB - insert");

                connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?,?,?,?)',[firstName, lastName, email, password1], function(err, results, fields) {
                  connection.release();

                  if (err) {
                    console.log("Error connecting to the database - insert");
                    throw err;
                  }
                  else {
                    console.log("Register and login successful. " + email);
                    req.session.email = email;
                    res.redirect('/');
                  }
                });
              }
            });
          }
        }
      });
    }
  });
});

module.exports = router;
