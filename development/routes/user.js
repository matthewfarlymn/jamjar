var express = require('express');
var router = express.Router();
var connect = require('../database/connect');


router.get('/dashboard/profile', function(req, res, next) {

    var firstName = req.session.firstName ? req.session.firstName : "";
    var lastName = req.session.lastName ? req.session.lastName : "";
    var address1 = req.session.address1 ? req.session.address1 : "";
    var address2 = req.session.address2 ? req.session.address2 : "";
    var city = req.session.city ? req.session.city : "";
    var postalcode = req.session.postalcode ? req.session.postalcode : "";
    var country = req.session.country ? req.session.country : "";
    var email = req.session.user ? req.session.user : "";
    var phoneNumber = req.session.phoneNumber ? req.session.phoneNumber : "";
    var avatar = req.session.avatar ? req.session.avatar : "";

    req.session.firstname = "";
    req.session.lastname = "";
    req.session.address1 = "";
    req.session.address2 = "";
    req.session.city = "";
    req.session.postalcode = "";
    req.session.country = "";
    // req.session.user = "";
    req.session.phonenumber = "";
    req.session.avatar = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email=?',[req.session.user],function(err, results, fields) {
                console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("User not found");
                }
                // user found
                else {
                    console.log("User found");
                    console.log(results[0].firstName);

                    req.body.firstName = results[0].firstName;
                    req.body.lastName = results[0].lastName;
                    results[0].address1 = req.body.address1;
                    results[0].address2 = req.body.address1;
                    results[0].city = req.body.city;
                    results[0].postalcode = req.body.postalcode;
                    results[0].country = req.body.country;
                    results[0].email = req.body.email;
                    results[0].phoneNumber = req.body.phoneNumber;
                    results[0].password1 = req.body.password1;
                    results[0].password2 = req.body.password2;
                    results[0].password3 = req.body.password3;
                    results[0].avatar = req.body.avatar;

                    // user = results;
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

                res.render('access', {
                  errorMessage: msg,
                  userEmail: userEmail,
                  email: email,
                  firstName: firstname,
                  lastName: lastname,
                });


                res.render('profile', {
                    access: req.session.user,
                    profile: true,
                    user: user
                });

            }
        });
    })

    // res.render('profile', {
    //     access: req.session.user,
    //     profile: true
    // });
});

router.get('/dashboard/orders', function(req, res, next) {

    res.render('orders', {
        access: req.session.user,
        orders: true
    });
});



router.get('/update-profile', function(req, res, next) {

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email=?',[req.session.user],function(err, results, fields) {
                console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("User not found");
                }
                // user found
                else {
                    console.log("User found");

                    results[0].firstName = req.body.firstName;
                    results[0].lastName = req.body.lastName;
                    results[0].address1 = req.body.address1;
                    results[0].address2 = req.body.address1;
                    results[0].city = req.body.city;
                    results[0].postalcode = req.body.postalcode;
                    results[0].country = req.body.country;
                    results[0].email = req.body.email;
                    results[0].phoneNumber = req.body.phoneNumber;
                    results[0].password1 = req.body.password1;
                    results[0].password2 = req.body.password2;
                    results[0].password3 = req.body.password3;
                    results[0].avatar = req.body.avatar;


                    user = results;
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
                res.render('dashboard', {
                    access: req.session.user,
                    user: user
                });
            }
        });
    })
});

//edit user

// SELECT product from products * product_details
// router.get('/selectUser/:id', function(req, res, next) {
//
//     var user ='';
//
//     if (req.params.id) {
//
//         connect(function(err, connection) {
//             if (err) {
//                 console.log("Error connecting to the database");
//                 throw err;
//             }
//             else {
//                 console.log("Connected to the DB");
//
//                 connection.query('SELECT * FROM users WHERE id=?',[req.params.id],function(err, results, fields) {
//                     // console.log('Query returned ' + JSON.stringify(results));
//
//                     if(err) {
//                         throw err;
//                     }
//                     // no user found
//                     else if (results.length === 0) {
//                         console.log("User not found");
//                     }
//                     // user found
//                     else {
//                         console.log("User found");
//
//                         user = results;
//                     }
//                 });
//
//             }
//
//             connection.commit(function(err) {
//                 connection.release();
//                 if (err) {
//                     connection.rollback(function() {
//                         throw err;
//                     });
//                 }
//                 else {
//                     res.render('selectUser', {
//                         access: req.session.user,
//                         user: user
//                     });
//                 }
//             });
//         });
//     }
// });
//
// // INSERT product
// router.post('/updateUser', function(req, res, next) {
//
//     var user = {};
//
//     user.firstname = req.body.firstName;
//     user.lastname = req.body.lastName;
//     user.street1 = req.body.street1;
//     user.street2 = req.body.street2;
//     user.city = req.body.city;
//     user.postalcode = req.body.postalcode;
//     user.country = req.body.country;
//     user.email = req.body.email;
//     user.phone = req.body.phone;
//     user.password1 = req.body.password1;
//     user.password2 = req.body.password2;
//     user.avatar = req.body.avatar;
//
//     connect(function(err, connection) {
//         if (err) {
//             console.log("Error connecting to the database");
//             throw err;
//         }
//         else {
//             console.log("Connected to the DB");
//
//             // connection.query('UPDATE users SET firtName=?, lastName=?, street1=?, street2=?, city=?, postalcode=?, country=?, email=?, phone=?, password=?, avatar=?',[user.firstname, user.lastname, user.street1, user.street2, user.city, user.postalcode, user.country, user.email, user.phone, user.passowrd, user.avatar], function(err, results, fields) {
//             connection.query('UPDATE users SET firtName=?, lastName=?, street1=?, street2=?, city=?, postalcode=?, country=?, phone=?, password=?, avatar=?',[user.firstname, user.lastname, user.street1, user.street2, user.city, user.postalcode, user.country, user.phone, user.passowrd1, user.avatar], function(err, results, fields) {
//                 // console.log('Query returned ' + JSON.stringify(results));
//
//                 if(err) {
//                   throw err;
//                 }
//                 else {
//                     product.id = results.insertId;
//                 }
//
//             });
//         }
//
//         connection.commit(function(err) {
//             connection.release();
//             if (err) {
//                 connection.rollback(function() {
//                     throw err;
//                 });
//             }
//             else {
//                 res.render('addProduct', {
//                     access: req.session.user,
//                     product: product
//                 });
//             }
//         });
//     });
// });
//
//
// // add product
// router.post('/addProduct', function(req, res, next) {
//
//     // var product = {};
//     // product.title = req.body.title;
//     // product.description = req.body.description;
//     // product.image1 = req.body.image1;
//     // product.image2 = req.body.image2;
//     // product.image3 = req.body.image3;
//     // product.image4 = req.body.image4;
//     // product.image5 = req.body.image5;
//     // product.size = req.body.size;
//     // product.color = req.body.color;
//     // product.stock = req.body.stock;
//     // product.price = req.body.price;
//     // product.saleprice = req.body.saleprice;
//     // product.status = req.body.status;
//
//     var title = req.body.title;
//     var description = req.body.description;
//     var image1 = req.body.image1;
//     var image2 = req.body.image2;
//     var image3 = req.body.image3;
//     var image4 = req.body.image4;
//     var image5 = req.body.image5;
//     var size = req.body.size;
//     var color = req.body.color;
//     var stock = req.body.stock;
//     var price = req.body.price;
//     var saleprice = req.body.saleprice;
//     var status = req.body.status;
//
//
//   connect(function(err, connection) {
//     if (err) {
//       console.log("Error connecting to the database - query");
//       throw err;
//     }
//     else {
//       console.log("Connected to the DB - query");
//
//       connection.query('SELECT * FROM products p INNER JOIN product_details d ON p.id = d.productsId',[], function(err, results, fields) {
//         connection.release();
//         // console.log('Query returned ' + JSON.stringify(results));
//
//         if(err) {
//           throw err;
//         }
//         // fail - email exists
//         // else if (results.length !== 0) {
//         //   console.log("Email already exists.");
//         //
//         //   req.session.msg = "Email already in use.";
//         //   req.session.user = email;
//         //   req.session.firstname = firstName;
//         //   req.session.lastname = lastName;
//         //   res.redirect('/addProduct');
//         // }
//         // else if (results.length === 0) {
//           // fail - title not entered
//           if (title.trim().length === 0) {
//             console.log("title field empty.");
//             req.session.msg = "Please enter product title.";
//             // req.session.firstname = firstName;
//             // req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - description not entered
//           else if (description.trim().length === 0) {
//             console.log("description field empty.");
//             req.session.msg = "Please enter product description.";
//             // req.session.user = email;
//             // req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - image1 not entered
//           // image2 thru image5 can empty
//           else if (image1.trim().length === 0) {
//             console.log("image1 field empty.");
//             req.session.msg = "Please enter an image.";
//             // req.session.user = email;
//             // req.session.firstname = firstName;
//             res.redirect('/addProduct');
//           }
//           // fail - confirm password not entered
//           else if (stock.trim().length === 0) {
//             console.log("stock field empty.");
//             req.session.msg = "Please enter product stock amount.";
//             // req.session.user = email;
//             // req.session.firstname = firstName;
//             // req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           else {
//
//             connect(function(err, connection) {
//               if (err) {
//                 console.log("Error connecting to the database");
//                 throw err;
//               }
//               else {
//                 console.log("Connected to the DB - insert");
//
//                 connection.query('INSERT INTO products (title, description, image1, image2, image3, image4, image5) VALUES(?,?,?,?,?,?,?)',[title, description, image1, image2, image3, image4, image5], function(err, results, fields) {
//                 // connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?,?,?,?)',[firstName, lastName, email, password1], function(err, results, fields) {
//                   connection.release();
//
//                   if (err) {
//                     console.log("Error connecting to the database - insert");
//                     throw err;
//                   }
//                   else {
//                     console.log("Register and login successful. " + email);
//                     req.session.user = email;
//                     res.redirect('/');
//                   }
//                 });
//               }
//             });
//           }
//         // }
//       });
//     }
//     connection.commit(function(err) {
//         connection.release();
//         if (err) {
//             connection.rollback(function() {
//                 throw err;
//             });
//         }
//         else {
//             res.render('addProduct', {
//                 access: req.session.user,
//                 product: product
//             });
//         }
//     });
//
//   });
// });
//
//
//
//
//
//
//
// router.get('/sign-in', function(req, res, next) {
//
//     var msg = req.session.msg ? req.session.msg : "";
//     var userEmail = req.session.userEmail ? req.session.userEmail : "";
//     var email = req.session.user ? req.session.user : "";
//     var firstname = req.session.firstname ? req.session.firstname : "";
//     var lastname = req.session.lastname ? req.session.lastname : "";
//
//     req.session.msg = "";
//     req.session.user = "";
//     req.session.firstname = "";
//     req.session.lastname = "";
//
//   res.render('access', {
//       errorMessage: msg,
//       userEmail: userEmail,
//       email: email,
//       firstName: firstname,
//       lastName: lastname,
//     });
// });
//
// // sign-in user
// router.post('/sign-in', function(req, res, next) {
//
//   // console.log("sign-in");
//
//   var email = req.body.email;
//   var password = req.body.password;
//
//   connect(function(err, connection) {
//     if (err) {
//       console.log("Error connecting to the database");
//       throw err;
//     }
//     else {
//       console.log("Connected to the DB");
//
//       connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
//         connection.release();
//         // console.log('Query returned ' + JSON.stringify(results));
//
//         if(err) {
//           throw err;
//         }
//         // successful login - id and password match
//         else if ((results.length !== 0) && (password === results[0].password)) {
//           console.log("Login successful!" + email);
//           req.session.user = email;
//           res.redirect('/');
//         }
//         // fail login - email not entered
//         else if (email.trim().length === 0) {
//           console.log("No email entered.");
//           req.session.msg = "Please enter email.";
//           res.redirect('/addProduct');
//         }
//         // fail login - password not entered
//         else if (password.trim().length === 0) {
//           console.log("No password entered.");
//           req.session.msg = "Please enter password.";
//           req.session.userEmail = email;
//           res.redirect('/addProduct');
//         }
//         // fail login - password does not match
//         else if ((results.length !== 0) && (password !== results[0].password)) {
//           console.log("Incorrect password.");
//           req.session.msg = "Password incorrect.";
//           req.session.userEmail = email;
//           res.redirect('/addProduct');
//         }
//         // fail login - email not found
//         else  {
//           console.log("Email not found.");
//           req.session.msg = email + " does not exist. Please register.";
//           res.redirect('/addProduct');
//         }
//       });
//     }
//   });
// });
//
// // register user
// router.post('/register', function(req, res, next) {
//
//   // console.log("register");
//
//   var email = req.body.email;
//   var firstName = req.body.firstName;
//   var lastName = req.body.lastName;
//   var password1 = req.body.password1;
//   var password2 = req.body.password2;
//
//   connect(function(err, connection) {
//     if (err) {
//       console.log("Error connecting to the database - query");
//       throw err;
//     }
//     else {
//       console.log("Connected to the DB - query");
//
//       connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
//         connection.release();
//         // console.log('Query returned ' + JSON.stringify(results));
//
//         if(err) {
//           throw err;
//         }
//         // fail - email exists
//         else if (results.length !== 0) {
//           console.log("Email already exists.");
//
//           req.session.msg = "Email already in use.";
//           req.session.user = email;
//           req.session.firstname = firstName;
//           req.session.lastname = lastName;
//           res.redirect('/addProduct');
//         }
//         else if (results.length === 0) {
//           // fail - email not entered
//           if (email.trim().length === 0) {
//             console.log("Email field empty.");
//             req.session.msg = "Please enter email.";
//             req.session.firstname = firstName;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - firstName not entered
//           else if (firstName.trim().length === 0) {
//             console.log("firstName field empty.");
//             req.session.msg = "Please enter firstname.";
//             req.session.user = email;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - lastName not entered
//           else if (lastName.trim().length === 0) {
//             console.log("lastName field empty.");
//             req.session.msg = "Please enter lastname.";
//             req.session.user = email;
//             req.session.firstname = firstName;
//             res.redirect('/addProduct');
//           }
//           // fail - password not entered
//           else if (password1.trim().length === 0) {
//             console.log("Password field empty.");
//             req.session.msg = "Please enter password.";
//             req.session.user = email;
//             req.session.firstname = firstName;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - confirm password not entered
//           else if (password2.trim().length === 0) {
//             console.log("Re-enter password field empty.");
//             req.session.msg = "Please re-enter password.";
//             req.session.user = email;
//             req.session.firstname = firstName;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - password and confirm password do not match
//           else if (password1.trim() !== password2.trim()) {
//             console.log("Confirm field empty.");
//             req.session.msg = "Password fields do not match. Please try again.";
//             req.session.user = email;
//             req.session.firstname = firstName;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           else {
//
//             connect(function(err, connection) {
//               if (err) {
//                 console.log("Error connecting to the database");
//                 throw err;
//               }
//               else {
//                 console.log("Connected to the DB - insert");
//
//                 connection.query('INSERT INTO users (firstName, lastName, email, password) VALUES (?,?,?,?)',[firstName, lastName, email, password1], function(err, results, fields) {
//                   connection.release();
//
//                   if (err) {
//                     console.log("Error connecting to the database - insert");
//                     throw err;
//                   }
//                   else {
//                     console.log("Register and login successful. " + email);
//                     req.session.user = email;
//                     res.redirect('/');
//                   }
//                 });
//               }
//             });
//           }
//         }
//       });
//     }
//   });
// });


module.exports = router;
