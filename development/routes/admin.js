var express = require('express');
var router = express.Router();
var connect = require('../database/connect');


//add products
//edit products
//update products
//edit users


router.get('/dashboard/profile', function(req, res, next) {

    res.render('profile', {
        access: req.session.email,
        admin: req.session.admin,
        profile: true
    });
});

router.get('/dashboard/orders', function(req, res, next) {

    res.render('orders', {
        access: req.session.email,
        admin: req.session.admin,
        orders: true
    });
});

router.get('/dashboard/products', function(req, res, next) {

    res.render('products', {
        access: req.session.email,
        admin: req.session.admin,
        products: true
    });
});

router.get('/dashboard/users', function(req, res, next) {

    res.render('users', {
        access: req.session.email,
        admin: req.session.admin,
        users: true
    });
});



// // SELECT product from products * product_details
// router.get('/selectProduct/:id/:title', function(req, res, next) {
//
//     var product ='';
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
//                 connection.query('SELECT * FROM products p INNER JOIN product_details d ON p.id = d.productsId WHERE d.productsId=?',[req.params.id],function(err, results, fields) {
//                     // console.log('Query returned ' + JSON.stringify(results));
//
//                     if(err) {
//                         throw err;
//                     }
//                     // no products found
//                     else if (results.length === 0) {
//                         console.log("No product found :(");
//                     }
//                     // products found
//                     else {
//                         console.log("Product found");
//
//                         product = results;
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
//                     res.render('selectProduct', {
//                         access: req.session.email,
//                         product: product
//                     });
//                 }
//             });
//         });
//     }
// });
//
// // INSERT product
// router.post('/addProduct', function(req, res, next) {
//
//     var product = {};
//     product.title = req.body.title;
//     product.description = req.body.description;
//     product.image1 = req.body.image1;
//     product.image2 = req.body.image2;
//     product.image3 = req.body.image3;
//     product.image4 = req.body.image4;
//     product.image5 = req.body.image5;
//
//     connect(function(err, connection) {
//         if (err) {
//             console.log("Error connecting to the database");
//             throw err;
//         }
//         else {
//             console.log("Connected to the DB");
//
//             connection.query('INSERT INTO products (title, description, image1, image2, image3, image4, image5) VALUES(?,?,?,?,?,?,?)',[product.title, product.description, product.image1, product.image2, product.image3, product.image4, product.image5], function(err, results, fields) {
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
//                     access: req.session.email,
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
//         //   req.session.email = email;
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
//             // req.session.email = email;
//             // req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - image1 not entered
//           // image2 thru image5 can empty
//           else if (image1.trim().length === 0) {
//             console.log("image1 field empty.");
//             req.session.msg = "Please enter an image.";
//             // req.session.email = email;
//             // req.session.firstname = firstName;
//             res.redirect('/addProduct');
//           }
//           // fail - confirm password not entered
//           else if (stock.trim().length === 0) {
//             console.log("stock field empty.");
//             req.session.msg = "Please enter product stock amount.";
//             // req.session.email = email;
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
//                     req.session.email = email;
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
//                 access: req.session.email,
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
//     var email = req.session.email ? req.session.email : "";
//     var firstname = req.session.firstname ? req.session.firstname : "";
//     var lastname = req.session.lastname ? req.session.lastname : "";
//
//     req.session.msg = "";
//     req.session.email = "";
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
//           req.session.email = email;
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
//           console.log("Email already exists.");
//
//           req.session.msg = "Email already in use.";
//           req.session.email = email;
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
//             req.session.email = email;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - lastName not entered
//           else if (lastName.trim().length === 0) {
//             console.log("lastName field empty.");
//             req.session.msg = "Please enter lastname.";
//             req.session.email = email;
//             req.session.firstname = firstName;
//             res.redirect('/addProduct');
//           }
//           // fail - password not entered
//           else if (password1.trim().length === 0) {
//             console.log("Password field empty.");
//             req.session.msg = "Please enter password.";
//             req.session.email = email;
//             req.session.firstname = firstName;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - confirm password not entered
//           else if (password2.trim().length === 0) {
//             console.log("Re-enter password field empty.");
//             req.session.msg = "Please re-enter password.";
//             req.session.email = email;
//             req.session.firstname = firstName;
//             req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // fail - password and confirm password do not match
//           else if (password1.trim() !== password2.trim()) {
//             console.log("Confirm field empty.");
//             req.session.msg = "Password fields do not match. Please try again.";
//             req.session.email = email;
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
//                     req.session.email = email;
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
