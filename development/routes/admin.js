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
                res.render('dashboard/profile', {
                    errorMessage: msg,
                    access: req.session.user,
                    owner: req.session.admin,
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

                if(err) {
                    throw err;
                }
                // error - email not entered
                else if (email.trim().length === 0) {
                    console.log("email field empty.");
                    req.session.msg = "Please enter email.";
                    // req.session.user = email;
                    // req.session.firstName = firstName;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - email already registered
                else if ((results.length !== 0) && (email !== req.session.user)) {
                    console.log("Email already registered");
                    req.session.msg = "Unable to update. Email address already registered.";
                    // req.session.user = email;
                    // req.session.firstName = firstName;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - firstname not entered
                else if (firstName.trim().length === 0) {
                    console.log("firstName field empty.");
                    req.session.msg = "Please enter Firstname.";
                    req.session.user = email;
                    // req.session.firstName = firstName;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - lastname not entered
                else if (lastName.trim().length === 0) {
                    console.log("lastname field empty.");
                    req.session.msg = "Please enter Lastname.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - current password empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    console.log("current password field empty.");
                    req.session.msg = "Current password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - new password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("new password field empty.");
                    req.session.msg = "New password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - confirm password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("new re-enter password field empty.");
                    req.session.msg = "Re-enter password missing. Please re-enter all password fields.";
                    // req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - new and confirm empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length === 0)) {
                    console.log("only current password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - current and confirm empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("only new password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    // req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - current and new empty
                else if ((password1.trim().length === 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("only re-enter password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/profile');
                }
                // okay - all password filds entered
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    // error - current does not match
                    if (password1.trim() !== results[0].password) {
                        console.log("current password does not match table.");
                        req.session.msg = "Current password is incorrect.  Please re-enter all password fields.";
                        req.session.user = email;
                        // req.session.lastName = lastName;
                        res.redirect('/admin/dashboard/profile');
                    }
                    // error - current and new do not match
                    else if (password2.trim() !== password3.trim()) {
                        console.log("new and confirm passwords does not match.");
                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
                        // req.session.user = email;
                        // req.session.lastName = lastName;
                        res.redirect('/admin/dashboard/profile');
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
                                        res.redirect('/admin/dashboard/profile');
                                        // res.redirect('/admin-session');
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
                                    res.redirect('/admin/dashboard/profile');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


router.get('/dashboard/orders', function(req, res, next) {

    var orderDetails = [];

    req.session.orderDetails = orderDetails;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");
            console.log('req.session.id: ' + req.session.userId);

            connection.query('SELECT d.id, d.date, d.userId, o.orderId, SUM(o.price * o.quantity) AS SubTotal, d.tax, d.shipping, u.firstName, u.lastName, u.email FROM orders o INNER JOIN order_details d ON o.orderId = d.id INNER JOIN users u ON d.userId = u.id GROUP BY o.orderId',[],function(err, results, fields) {
                console.log('Query returned3 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("No orders found for user");
                    orderData = false;
                }
                // user found
                else {
                    console.log("Orders found for user");
                    orderData = true;

                    for (var i=0; i<results.length; i++) {

                        var orderDetail = {};

                        var total = results[i].SubTotal + results[i].tax + results[i].shipping;

                        var d = results[i].date;
                        var curr_date = d.getDate();
                        var curr_month = d.getMonth() + 1;
                        var curr_year = d.getFullYear();

                        if (curr_date < 10) {
                            curr_date = '0' + curr_date
                        }
                        if (curr_month < 10) {
                            curr_month = '0' + curr_month
                        }

                        orderDetail.id = results[i].id;
                        orderDetail.date = curr_date + "/" + curr_month + "/" + curr_year;
                        orderDetail.subtotal = results[i].SubTotal.toFixed(2);
                        orderDetail.tax = results[i].tax.toFixed(2);
                        orderDetail.shipping = results[i].shipping.toFixed(2);
                        orderDetail.total = total.toFixed(2);
                        orderDetail.firstName = results[i].firstName;
                        orderDetail.lastName = results[i].lastName;
                        orderDetail.email = results[i].email;

                        console.log(orderDetail);
                        orderDetails.push(orderDetail);
                    }
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
                res.render('dashboard/orders', {
                    // errorMessage: msg,
                    access: req.session.user,
                    owner: req.session.admin,
                    orders: true,
                    userId: userId,
                    orderDetails: orderDetails,
                    orderData: orderData
                });
            }
        });
    })
});


router.get('/dashboard/order/:id', function(req, res, next) {

    var orderDetails = [];
    var productDetails = [];

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");
            console.log('req.session.id: ' + req.session.userId);

            connection.query('SELECT d.id, d.date, d.userId, o.orderId, SUM(o.price * o.quantity) AS SubTotal, d.tax, d.shipping, u.firstName, u.lastName, u.email, u.phoneNumber FROM orders o INNER JOIN order_details d ON o.orderId = d.id INNER JOIN users u ON d.userId = u.id WHERE o.orderId=? GROUP BY o.orderId',[req.params.id],function(err, results, fields) {
                console.log('Query returned4 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("No orders found for user");
                    orderData = false;
                }
                // user found
                else {
                    console.log("Orders found for user");
                    orderData = true;

                    for (var i=0; i<results.length; i++) {

                        var orderDetail = {};

                        var total = results[i].SubTotal + results[i].tax + results[i].shipping;

                        var d = results[i].date;
                        var curr_date = d.getDate();
                        var curr_month = d.getMonth() + 1;
                        var curr_year = d.getFullYear();

                        if (curr_date < 10) {
                            curr_date = '0' + curr_date
                        }
                        if (curr_month < 10) {
                            curr_month = '0' + curr_month
                        }

                        orderDetail.id = results[i].id;
                        orderDetail.date = curr_date + "/" + curr_month + "/" + curr_year;
                        orderDetail.subtotal = results[i].SubTotal.toFixed(2);
                        orderDetail.tax = results[i].tax.toFixed(2);
                        orderDetail.shipping = results[i].shipping.toFixed(2);
                        orderDetail.total = total.toFixed(2);
                        orderDetail.firstName = results[i].firstName;
                        orderDetail.lastName = results[i].lastName;
                        orderDetail.email = results[i].email;
                        orderDetail.phoneNumber = results[i].phoneNumber;

                        console.log(orderDetail);
                        orderDetails.push(orderDetail);
                    }
                }
            });

            connection.query('SELECT o.id, o.orderId, o.price, o.quantity, p.title, p.description, p.image1 FROM orders o INNER JOIN product_details d ON o.productId = d.id INNER JOIN products p ON d.productsId = p.id  WHERE o.orderId=? GROUP BY o.id',[req.params.id],function(err, results, fields) {
                console.log('Query returned5 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("No product details found for order");
                    // orderData = false;
                }
                // user found
                else {
                    console.log("Product details found for order");
                    // orderData = true;

                    for (var i=0; i<results.length; i++) {

                        var product = {};

                        var subtotal = results[i].price * results[i].quantity;

                        var excerptLength = 75;
                        var description = results[i].description;
                        var excerpt = "";

                        if (description.length > excerptLength) {
                            excerpt = description.substring(0,excerptLength).trim() + '...';
                        }
                        else {
                            excerpt = description;
                        }

                        product.image = results[i].image1;
                        product.title = results[i].title;
                        product.excerpt = excerpt;
                        product.price = results[i].price.toFixed(2);
                        product.quantity = results[i].quantity;
                        product.subtotal = subtotal.toFixed(2);

                        console.log(product);
                        productDetails.push(product);
                    }
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
                res.render('dashboard/order', {
                    access: req.session.user,
                    owner: req.session.admin,
                    orders: true,
                    orderDetails: orderDetails,
                    productDetails: productDetails
                });
            }
        });
    });
});


router.get('/dashboard/products', function(req, res, next) {

    var productDetails = [];

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM products ORDER BY id',[],function(err, results, fields) {
                console.log('Query returned6 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("No products found");
                    productData = false;
                }
                // user found
                else {
                    console.log("Products found");
                    productData = true;

                    productDetails = results;

                    console.log(productDetails);
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
                res.render('dashboard/products', {
                    access: req.session.user,
                    owner: req.session.admin,
                    productData: productData,
                    products: true,
                    productDetails: productDetails
                });
            }
        });
    });
});

// router.get('/dashboard/edit-product/:id', function(req, res, next) {
//
//     var msg = req.session.msg ? req.session.msg : "";
//
//     req.session.msg = "";
//
//
//     var title = req.body.title;
//     var description = req.body.description;
//     var image1 = req.body.image1;
//     var image2 = req.body.image2;
//     var image3 = req.body.image3;
//     var image4 = req.body.image4;
//     var image5 = req.body.image5;
//     var status = req.body.status;
//
//     var size1 = req.body.size1;
//     var color1 = req.body.color1;
//     var stock1 = req.body.stock1;
//     var price1 = req.body.price1;
//     var salePrice1 = req.body.salePrice1;
//     var productStatus1 = req.body.productStatus1;
//
//     var size = req.body.size;
//     var color = req.body.color;
//     var stock = req.body.stock;
//     var price = req.body.price;
//     var salePrice = req.body.salePrice;
//     var productStatus = req.body.productStatus;
//
//     connect(function(err, connection) {
//         if (err) {
//             console.log("Error connecting to the database");
//             throw err;
//         }
//         else {
//             console.log("Connected to the DB");
//
//             connection.query('SELECT * FROM products p INNER JOIN product_details d ON p.id = d.productsId WHERE p.id=? GROUP BY p.id ORDER BY p.id',[req.params.id],function(err, results, fields) {
//                 console.log('Query returned7 ' + JSON.stringify(results));
//
//                 if(err) {
//                     throw err;
//                 }
//                 // error - title not entered
//                 else if (title.trim().length === 0) {
//                     console.log("title field empty.");
//                     req.session.msg = "Please enter product title.";
//                     res.redirect('/admin/dashboard/edit-product');
//                 }
//                 // error - description not entered
//                 else if (description.length !== 0) {
//                     console.log("description field empty.");
//                     req.session.msg = "Please enter product description.";
//                     res.redirect('/admin/dashboard/edit-product');
//                 }
//                 // error - image1 not entered
//                 else if (image1.trim().length === 0) {
//                     console.log("image1 field empty.");
//                     req.session.msg = "Please enter master image.";
//                     // req.session.firstName = firstName;
//                     // req.session.lastName = lastName;
//                     res.redirect('/admin/dashboard/edit-product');
//                 }
//
//                 for (var i=0; i<results.length; i++){
//                     // error - price not entered
//                     else if (price.trim().length === 0) {
//                         console.log("price field empty - row " + i);
//                         req.session.msg = "Please enter price on row " + i;
//                         // req.session.user = email;
//                         // req.session.lastName = lastName;
//                         res.redirect('/admin/dashboard/edit-product');
//                     }
//                     // error - sale price not entered
//                     else if (salePrice.trim().length === 0) {
//                         console.log("sale price field empty - row " + i);
//                         req.session.msg = "Please enter sale price on row " + i;
//                         // req.session.user = email;
//                         // req.session.lastName = lastName;
//                         res.redirect('/admin/dashboard/edit-product');
//                     }
//                 }
//                 else {
//
//                     connect(function(err, connection) {
//                         if (err) {
//                             console.log("Error connecting to the database");
//                             throw err;
//                         }
//                         else {
//                             console.log("Connected to the DB");
//
//                             connection.query('UPDATE products SET title=?, description=?, image1=?, image2=?, image3=?, image4=?, image5=?, status=? WHERE id=?',[title, description, image1, image2, image3, image4, image5, status, req.params.id], function(err, results, fields) {
//                                 connection.release();
//
//                                 if (err) {
//                                     console.log("Error connecting to the database - update1");
//                                     throw err;
//                                 }
//                                 else {
//                                     console.log("Product update successful.");
//                                     // req.session.user = email;
//                                     res.redirect('/admin/dashboard/edit-product');
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// });

router.get('/dashboard/add-product/:id', function(req, res, next) {

    res.render('dashboard/products', {
        access: req.session.user,
        owner: req.session.admin,
        productData: productData,
        products: true
    });
});


router.get('/dashboard/users', function(req, res, next) {

    var userDetails = [];

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users ORDER BY id',[],function(err, results, fields) {
                console.log('Query returned8 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("No users found");
                    userData = false;
                }
                // user found
                else {
                    console.log("Users found");
                    userData = true;

                    userDetails = results;
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
                res.render('dashboard/users', {
                    access: req.session.user,
                    owner: req.session.admin,
                    userData: userData,
                    users: true,
                    userDetails: userDetails
                });
            }
        });
    });
});

router.get('/dashboard/edit-user/:id/:email', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var successMsg = req.session.successMsg ? req.session.successMsg : "";
    // var userId = req.session.userId ? req.session.userId : "";
    var firstName = req.session.firstName ? req.session.firstName : "";
    var lastName = req.session.lastName ? req.session.lastName : "";
    var address1 = req.session.address1 ? req.session.address1 : "";
    var address2 = req.session.address2 ? req.session.address2 : "";
    var city = req.session.city ? req.session.city : "";
    var province = req.session.province ? req.session.province : "";
    var postalcode = req.session.postalcode ? req.session.postalcode : "";
    var country = req.session.country ? req.session.country : "";
    var email = req.session.email ? req.session.email : "";
    var phoneNumber = req.session.phoneNumber ? req.session.phoneNumber : "";
    var avatar = req.session.avatar ? req.session.avatar : "";
    var userType = req.session.userType ? req.session.userType : "";

    req.session.msg = "";
    req.session.successMsg = "";
    // req.session.userId = "";
    req.session.firstName = "";
    req.session.lastName = "";
    req.session.address1 = "";
    req.session.address2 = "";
    req.session.city = "";
    req.session.province = "";
    req.session.postalcode = "";
    req.session.country = "";
    req.session.email = "";
    req.session.phoneNumber = "";
    req.session.avatar = "";
    req.session.userType = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE id=? AND email=?',[req.params.id, req.params.email],function(err, results, fields) {
                console.log('Query returned9 ' + JSON.stringify(results));

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

                    userId = results[0].id;
                    firstName = req.session.firstName = results[0].firstName;
                    lastName = req.session.lastName = results[0].lastName;
                    address1 = req.session.address1 = results[0].address1;
                    address2 = req.session.address2 = results[0].address2;
                    city = req.session.city = results[0].city;
                    province = req.session.province = results[0].province;
                    postalcode = req.session.postalcode = results[0].postalcode;
                    country = req.session.country = results[0].country;
                    email = req.session.email = results[0].email;
                    phoneNumber = req.session.phoneNumber = results[0].phoneNumber;
                    avatar = req.session.avatar = results[0].avatar;
                    userType = req.session.userType = results[0].userType;
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
                res.render('dashboard/user', {
                    errorMessage: msg,
                    successMessage: successMsg,
                    access: req.session.user,
                    owner: req.session.admin,
                    users: true,
                    add: false,
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
                    avatar: avatar,
                    userType: userType
                });
            }
        });
    })
});




router.post('/dashboard/update-user/:id/:email', function(req, res, next) {

    console.log("** update-user");

    var userId = req.params.id;
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
    var avatar = req.body.avatar;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE id=? AND email=?',[req.params.id, req.params.email],function(err, results, fields) {
                console.log('Query returned10 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // error - email not entered
                if (email.trim().length === 0) {
                    console.log("email field empty.");
                    req.session.msg = "Please enter email.";
                    // req.session.user = email;
                    // req.session.firstName = firstName;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - email already registered
                else if ((results.length !== 0) && (email !== results[0].email)) {
                    console.log("Email already registered");
                    req.session.msg = "Unable to update. Email address already registered.";
                    req.params.email = email;
                    // req.session.firstName = firstName;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - firstname not entered
                else if (firstName.trim().length === 0) {
                    console.log("firstName field empty.");
                    req.session.msg = "Please enter Firstname.";
                    req.session.user = email;
                    // req.session.firstName = firstName;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - lastname not entered
                else if (lastName.trim().length === 0) {
                    console.log("lastName field empty.");
                    req.session.msg = "Please enter Lastname.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - new password empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0)) {
                    console.log("new password field empty.");
                    req.session.msg = "New password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - confirm password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0)) {
                    console.log("re-enter password field empty.");
                    req.session.msg = "Confirm password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    // req.session.lastName = lastName;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // okay - all password filds entered
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0)) {
                    // error - new and confirm do not match
                    if (password1.trim() !== password2.trim()) {
                        console.log("new and confirm passwords does not match.");
                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
                        // req.session.user = email;
                        // req.session.lastName = lastName;
                        res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
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
                                connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, password=?, avatar=? WHERE id=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, password1, avatar, req.params.id], function(err, results, fields) {
                                    connection.release();

                                    if (err) {
                                        console.log("Error connecting to the database - update1");
                                        throw err;
                                    }
                                    else {
                                        console.log("User update successful. " + email);
                                        req.session.successMsg = "User successfully updated.";
                                        res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                                    }
                                });
                            }
                        });
                    }
                }

                // okay - no password fields entered
                else {
                    connect(function(err, connection) {
                        if (err) {
                            console.log("Error connecting to the database");
                            throw err;
                        }
                        else {
                            console.log("Connected to the DB");

                            // update does not replace password
                            // connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, avatar) VALUES (?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, avatar], function(err, results, fields) {
                            connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, avatar=? WHERE id=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, avatar, req.params.id], function(err, results, fields) {
                                connection.release();

                                if (err) {
                                    console.log("Error connecting to the database - update2");
                                    throw err;
                                }
                                else {
                                    console.log("User update successful - no password change. " + email);
                                    req.session.successMsg = "User successfully updated.";
                                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get('/dashboard/add-new-user', function(req, res, next) {

    var msg = req.session.msg = "";
    var firstName = req.session.firstName = "";
    var lastName = req.session.lastName = "";
    var address1 = req.session.address1 = "";
    var address2 = req.session.address2 = "";
    var city = req.session.city = "";
    var province = req.session.province = "";
    var postalcode = req.session.postalcode = "";
    var country = req.session.country = "";
    var email = req.session.email = "";
    var phoneNumber = req.session.phoneNumber = "";
    var avatar = req.session.avatar = "";
    var userType = req.session.userType = "";

    res.redirect('/admin/dashboard/add-user');
});

router.get('/dashboard/add-user', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var firstName = req.session.firstName ? req.session.firstName : "";
    var lastName = req.session.lastName ? req.session.lastName : "";
    var address1 = req.session.address1 ? req.session.address1 : "";
    var address2 = req.session.address2 ? req.session.address2 : "";
    var city = req.session.city ? req.session.city : "";
    var province = req.session.province ? req.session.province : "";
    var postalcode = req.session.postalcode ? req.session.postalcode : "";
    var country = req.session.country ? req.session.country : "";
    var email = req.session.email ? req.session.email : "";
    var phoneNumber = req.session.phoneNumber ? req.session.phoneNumber : "";
    var avatar = req.session.avatar ? req.session.avatar : "";
    var userType = req.session.userType ? req.session.userType : "";

    req.session.msg = "";
    req.session.firstName = "";
    req.session.lastName = "";
    req.session.address1 = "";
    req.session.address2 = "";
    req.session.city = "";
    req.session.province = "";
    req.session.postalcode = "";
    req.session.country = "";
    req.session.email = "";
    req.session.phoneNumber = "";
    req.session.avatar = "";
    req.session.userType = "";

    res.render('dashboard/user', {
        errorMessage: msg,
        access: req.session.user,
        owner: req.session.admin,
        users: true,
        add: true,
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
        avatar: avatar,
        userType: userType
    });
});


router.post('/dashboard/save-user', function(req, res, next) {

    var userId = "";
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
    var avatar = req.body.avatar;
    var userType = req.body.userType;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            // error - email not entered
            if (email.trim().length === 0) {
                console.log("email field empty.");
                req.session.msg = "Please enter email.";
                // req.session.email = email;
                req.session.firstName = firstName;
                req.session.lastName = lastName;
                res.redirect('/admin/dashboard/add-user');
            }
            else {
                console.log("Connected to the DB");

                connection.query('SELECT * FROM users WHERE email=?',[email],function(err, results, fields) {
                    console.log('Query returned11 ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    else if (results.length !== 0) {
                        console.log("Email already registered");
                        req.session.msg = "Unable to insert. Email address already registered.";
                        req.session.firstName = firstName;
                        req.session.lastName = lastName;
                        req.session.address1 = address1;
                        req.session.address2 = address2;
                        req.session.city = city;
                        req.session.province = province;
                        req.session.postalcode = postalcode;
                        req.session.country = country;
                        req.session.phoneNumber = phoneNumber;
                        req.session.avatar = avatar;
                        req.session.userType = userType;
                        res.redirect('/admin/dashboard/add-user');
                    }
                    else {
                        // error - firstname not entered
                        if (firstName.trim().length === 0) {
                            console.log("firstName field empty.");
                            req.session.msg = "Please enter Firstname.";
                            req.session.lastName = lastName;
                            req.session.address1 = address1;
                            req.session.address2 = address2;
                            req.session.city = city;
                            req.session.province = province;
                            req.session.postalcode = postalcode;
                            req.session.country = country;
                            req.session.email = email;
                            req.session.phoneNumber = phoneNumber;
                            req.session.avatar = avatar;
                            req.session.userType = userType;
                            res.redirect('/admin/dashboard/add-user');
                        }
                        // error - lastname not entered
                        else if (lastName.trim().length === 0) {
                            console.log("lastName field empty.");
                            req.session.msg = "Please enter Lastname.";
                            req.session.firstName = firstName;
                            req.session.address1 = address1;
                            req.session.address2 = address2;
                            req.session.city = city;
                            req.session.province = province;
                            req.session.postalcode = postalcode;
                            req.session.country = country;
                            req.session.email = email;
                            req.session.phoneNumber = phoneNumber;
                            req.session.avatar = avatar;
                            req.session.userType = userType;
                            res.redirect('/admin/dashboard/add-user');
                        }
                        // error - new password empty
                        else if ((password1.trim().length === 0) && (password2.trim().length !== 0)) {
                            console.log("new password field empty.");
                            req.session.msg = "New password missing. Please re-enter all password fields.";
                            req.session.firstName = firstName;
                            req.session.lastName = lastName;
                            req.session.address1 = address1;
                            req.session.address2 = address2;
                            req.session.city = city;
                            req.session.province = province;
                            req.session.postalcode = postalcode;
                            req.session.country = country;
                            req.session.email = email;
                            req.session.phoneNumber = phoneNumber;
                            req.session.avatar = avatar;
                            req.session.userType = userType;
                            res.redirect('/admin/dashboard/add-user');
                        }
                        // error - confirm password empty
                        else if ((password1.trim().length !== 0) && (password2.trim().length === 0)) {
                            console.log("re-enter password field empty.");
                            req.session.msg = "Confirm password missing. Please re-enter all password fields.";
                            req.session.firstName = firstName;
                            req.session.lastName = lastName;
                            req.session.address1 = address1;
                            req.session.address2 = address2;
                            req.session.city = city;
                            req.session.province = province;
                            req.session.postalcode = postalcode;
                            req.session.country = country;
                            req.session.email = email;
                            req.session.phoneNumber = phoneNumber;
                            req.session.avatar = avatar;
                            req.session.userType = userType;
                            res.redirect('/admin/dashboard/add-user');
                        }
                        // okay - all password filds entered
                        else if ((password1.trim().length !== 0) && (password2.trim().length !== 0)) {
                            // error - new and confirm do not match
                            if (password1.trim() !== password2.trim()) {
                                console.log("new and confirm passwords does not match.");
                                req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
                                req.session.firstName = firstName;
                                req.session.lastName = lastName;
                                req.session.address1 = address1;
                                req.session.address2 = address2;
                                req.session.city = city;
                                req.session.province = province;
                                req.session.postalcode = postalcode;
                                req.session.country = country;
                                req.session.email = email;
                                req.session.phoneNumber = phoneNumber;
                                req.session.avatar = avatar;
                                req.session.userType = userType;
                                res.redirect('/admin/dashboard/add-user');
                            }
                            else {

                                connect(function(err, connection) {
                                    if (err) {
                                        console.log("Error connecting to the database");
                                        throw err;
                                    }
                                    else {
                                        console.log("Connected to the DB");

                                        connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, password, avatar, userType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, password1, avatar, userType], function(err, results, fields) {

                                            if (err) {
                                                console.log("Error connecting to the database - add");
                                                throw err;
                                            }
                                            else {

                                                connect(function(err, connection) {
                                                    if (err) {
                                                        console.log("Error connecting to the database");
                                                        throw err;
                                                    }
                                                    else {
                                                        console.log("Connected to the DB");

                                                        connection.query('SELECT * FROM users WHERE email=?',[email],function(err, results, fields) {
                                                            // connection.release();
                                                            console.log('Query returned12 ' + JSON.stringify(results));

                                                            if(err) {
                                                                throw err;
                                                            }
                                                            // no user found
                                                            else if (results.length === 0) {
                                                                console.log("User not found");
                                                            }
                                                            // user found
                                                            else {
                                                                userId = results[0].id;
                                                                email = results[0].email;
                                                                req.session.successMsg = "Successfully added user " + email;
                                                                console.log("User inserted successful. " + userId + " " + email);
                                                                res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                                                            }
                                                        });
                                                    }

                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
                connection.commit(function(err) {
                    connection.release();
                    if (err) {
                        connection.rollback(function() {
                            throw err;
                        });
                    }
                });
            }
        }
    });

});


module.exports = router;
