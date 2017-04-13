var express = require('express');
var router = express.Router();
var connect = require('../database/connect');


router.get('/dashboard/profile', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var firstName = req.session.firstName ? req.session.firstName : "";
    var lastName = req.session.lastName ? req.session.lastName : "";
    var address1 = req.session.address1 ? req.session.address1 : "";
    var address2 = req.session.address2 ? req.session.address2 : "";
    var city = req.session.city ? req.session.city : "";
    var province = req.session.province ? req.session.province : "";
    var postalcode = req.session.postalcode ? req.session.postalcode : "";
    var country = req.session.country ? req.session.country : "";
    var email = req.session.user ? req.session.user : "";
    var phoneNumber = req.session.phoneNumber ? req.session.phoneNumber : "";
    var avatar = req.session.avatar ? req.session.avatar : "";

    req.session.msg = "";
    req.session.firstName = "";
    req.session.lastName = "";
    req.session.address1 = "";
    req.session.address2 = "";
    req.session.city = "";
    req.session.province = "";
    req.session.postalcode = "";
    req.session.country = "";
    // req.session.user = "";
    req.session.phoneNumber = "";
    req.session.avatar = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email=?',[req.session.user],function(err, results, fields) {
                console.log('Query returned1 ' + JSON.stringify(results));

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

                    userId = req.session.userId = results[0].id;
                    firstName = req.session.firstName = results[0].firstName;
                    lastName = req.session.lastName = results[0].lastName;
                    address1 = req.session.address1 = results[0].address1;
                    address2 = req.session.address2 = results[0].address2;
                    city = req.session.city = results[0].city;
                    province = req.session.province = results[0].province;
                    postalcode = req.session.postalcode = results[0].postalcode;
                    country = req.session.country = results[0].country;
                    email = req.session.user = results[0].email;
                    phoneNumber = req.session.phoneNumber = results[0].phoneNumber;
                    avatar = req.session.avatar = results[0].avatar;

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
                console.log("render");
                res.render('dashboard/profile', {
                    errorMessage: msg,
                    access: req.session.user,
                    profile: true,
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    address1: address1,
                    address2: address2,
                    city: city,
                    province: province,
                    postalcode: postalcode,
                    country: country,
                    email: email,
                    phoneNumber: phoneNumber,
                    avatar: avatar
                });
            }
        });
    })
});

router.get('/dashboard/orders', function(req, res, next) {

    res.render('dashboard/orders', {
        access: req.session.user,
        orders: true
    });
});



router.post('/update-profile', function(req, res, next) {

    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var city = req.body.city;
    var province = req.body.province;
    var postalcode = req.body.postalcode;
    var country = req.body.country;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    var password1 = req.body.password1;
    var password2 = req.body.password2;
    var password3 = req.body.password3;
    var avatar = req.body.avatar;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email=?',[email],function(err, results, fields) {
                console.log('Query returned2 ' + JSON.stringify(results));
                // console.log('results[0].email ' + results[0].email);

                if(err) {
                    throw err;
                }
                // error - email not entered
                else if (email.trim().length === 0) {
                    console.log("email field empty.");
                    req.session.msg = "Please enter email.";
                    // req.session.user = email;
                    // req.session.firstname = firstName;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - email already registered
                else if ((results.length !== 0) && (email !== req.session.user)) {
                    console.log("Email already registered");
                    req.session.msg = "Unable to update. Email address already registered.";
                    // req.session.user = email;
                    // req.session.firstname = firstName;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - firstname not entered
                else if (firstName.trim().length === 0) {
                    console.log("firstName field empty.");
                    req.session.msg = "Please enter Firstname.";
                    req.session.user = email;
                    // req.session.firstname = firstName;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - lastname not entered
                else if (lastName.trim().length === 0) {
                    console.log("lastname field empty.");
                    req.session.msg = "Please enter Lastname.";
                    req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - current password empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    console.log("current password field empty.");
                    req.session.msg = "Current password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - new password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("new password field empty.");
                    req.session.msg = "New password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - confirm password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("new re-enter password field empty.");
                    req.session.msg = "Re-enter password missing. Please re-enter all password fields.";
                    // req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - new and confirm empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length === 0)) {
                    console.log("only current password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - current and confirm empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("only new password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    // req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // error - current and new empty
                else if ((password1.trim().length === 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("only re-enter password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
                    // req.session.lastname = lastName;
                    res.redirect('/user/dashboard/profile');
                }
                // okay - all password filds entered
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    // error - current does not match
                    if (password1.trim() !== results[0].password) {
                        console.log("current password does not match table.");
                        req.session.msg = "Current password is incorrect.  Please re-enter all password fields.";
                        req.session.user = email;
                        // req.session.lastname = lastName;
                        res.redirect('/user/dashboard/profile');
                    }
                    // error - current and new do not match
                    else if (password2.trim() !== password3.trim()) {
                        console.log("new and confirm passwords does not match.");
                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
                        // req.session.user = email;
                        // req.session.lastname = lastName;
                        res.redirect('/user/dashboard/profile');
                    }

                    else {

                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {
                                console.log("Connected to the DB");

                                // update replaces password
                                // connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, password, avatar) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, password2, avatar], function(err, results, fields) {
                                connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, password=?, avatar=? WHERE email=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, password2, avatar, req.session.user], function(err, results, fields) {
                                    connection.release();

                                    if (err) {
                                        console.log("Error connecting to the database - update1");
                                        throw err;
                                    }
                                    else {
                                        console.log("User update successful. " + email);
                                        req.session.user = email;
                                        res.redirect('/user/dashboard/profile');
                                        // res.redirect('/user-session');
                                    }
                                });
                            }
                        });

                    }
                }

                // okay - no password filds entered
                else {
                    connect(function(err, connection) {
                        if (err) {
                            console.log("Error connecting to the database");
                            throw err;
                        }
                        else {
                            console.log("Connected to the DB");
                            console.log("email: " + email);
                            console.log("req.session.user: " + req.session.user);

                            // update does not replace password
                            // connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, avatar) VALUES (?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, avatar], function(err, results, fields) {
                            connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, avatar=? WHERE email=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, avatar, req.session.user], function(err, results, fields) {
                                connection.release();

                                if (err) {
                                    console.log("Error connecting to the database - update2");
                                    throw err;
                                }
                                else {
                                    console.log("User update successful - no password change. " + email);
                                    req.session.user = email;
                                    res.redirect('/user/dashboard/profile');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

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
//                 res.render('dashboard', {
//                     access: req.session.user,
//                     user: user
//                 });
//             }
//         });
//     })
// });

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
//             // connection.query('UPDATE users SET firstName=?, lastName=?, street1=?, street2=?, city=?, postalcode=?, country=?, email=?, phone=?, password=?, avatar=?',[user.firstname, user.lastname, user.street1, user.street2, user.city, user.postalcode, user.country, user.email, user.phone, user.passowrd, user.avatar], function(err, results, fields) {
//             connection.query('UPDATE users SET firstName=?, lastName=?, street1=?, street2=?, city=?, postalcode=?, country=?, phone=?, password=?, avatar=?',[user.firstname, user.lastname, user.street1, user.street2, user.city, user.postalcode, user.country, user.phone, user.passowrd1, user.avatar], function(err, results, fields) {
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
//         // error - email exists
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
//           // error - title not entered
//           if (title.trim().length === 0) {
//             console.log("title field empty.");
//             req.session.msg = "Please enter product title.";
//             // req.session.firstname = firstName;
//             // req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // error - description not entered
//           else if (description.trim().length === 0) {
//             console.log("description field empty.");
//             req.session.msg = "Please enter product description.";
//             // req.session.user = email;
//             // req.session.lastname = lastName;
//             res.redirect('/addProduct');
//           }
//           // error - image1 not entered
//           // image2 thru image5 can empty
//           else if (image1.trim().length === 0) {
//             console.log("image1 field empty.");
//             req.session.msg = "Please enter an image.";
//             // req.session.user = email;
//             // req.session.firstname = firstName;
//             res.redirect('/addProduct');
//           }
//           // error - confirm password not entered
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



module.exports = router;
