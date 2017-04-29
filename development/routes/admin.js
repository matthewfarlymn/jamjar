var express = require('express');
var router = express.Router();
var connect = require('../database/connect');
var multer = require('multer');

var avatarStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/uploads/users/');
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var fileExtension = filename.split(".")[1];
        cb(null, req.session.userId + "." + fileExtension);
    }
});

var avatarUpload = multer({
    storage: avatarStorage
});

var productImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/uploads/products/');
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var fileExtension = filename.split(".")[1];
        cb(null, Date.now() + "-" + req.session.productId + "." + fileExtension);
    }
});

var productImageUpload = multer({
    storage: productImageStorage
});

var settingsImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './assets/uploads/settings/');
    },
    filename: function (req, file, cb) {
        var filename = file.originalname;
        var fileExtension = filename.split(".")[1];
        cb(null, Date.now() + "-" + req.session.settingsId + "." + fileExtension);
    }
});

var settingsImageUpload = multer({
    storage: settingsImageStorage
});

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
                // console.log('Query returned1 ' + JSON.stringify(results));

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
    });
});

router.post('/update-profile', avatarUpload.single('avatar'), function(req, res, next) {

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
    var avatar;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database - 2");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email=?',[email],function(err, results, fields) {
                // console.log('Query returned2 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // error - email not entered
                else if (email.trim().length === 0) {
                    console.log("email field empty.");
                    req.session.msg = "Please enter email.";
                    res.redirect('/admin/dashboard/profile');
                }
                // error - email already registered
                else if ((results.length !== 0) && (email !== req.session.user)) {
                    console.log("Email already registered - update profile");
                    req.session.msg = "Unable to update. Email address already registered.";
                    res.redirect('/admin/dashboard/profile');
                }
                // error - firstname not entered
                else if (firstName.trim().length === 0) {
                    console.log("firstName field empty.");
                    req.session.msg = "Please enter Firstname.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - lastname not entered
                else if (lastName.trim().length === 0) {
                    console.log("lastname field empty.");
                    req.session.msg = "Please enter Lastname.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - current password empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    console.log("current password field empty.");
                    req.session.msg = "Current password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - new password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("new password field empty.");
                    req.session.msg = "New password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/profile');
                }
                // error - confirm password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("new re-enter password field empty.");
                    req.session.msg = "Re-enter password missing. Please re-enter all password fields.";
                    res.redirect('/admin/dashboard/profile');
                }
                // error - new and confirm empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length === 0)) {
                    console.log("only current password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
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
                        res.redirect('/admin/dashboard/profile');
                    }
                    // error - current and new do not match
                    else if (password2.trim() !== password3.trim()) {
                        console.log("new and confirm passwords does not match.");
                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
                        res.redirect('/admin/dashboard/profile');
                    }

                    else {

                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database - 3");
                                throw err;
                            }
                            else {
                                console.log("Connected to the DB");

                                avatar = results[0].avatar;

                                if(req.file) {
                                    avatar = req.file.filename;
                                }

                                // update replaces password
                                // connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, password, avatar) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, password2, avatar], function(err, results, fields) {
                                connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, password=?, avatar=? WHERE email=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, password2, avatar, req.session.user], function(err, results, fields) {
                                    connection.release();

                                    if (err) {
                                        console.log("Error connecting to the database - update4");
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
                            console.log("Error connecting to the database - 5");
                            throw err;
                        }
                        else {
                            console.log("Connected to the DB");
                            console.log("email: " + email);
                            console.log("req.session.user: " + req.session.user);

                            avatar = results[0].avatar;

                            if(req.file) {
                                avatar = req.file.filename;
                            }

                            // update does not replace password
                            // connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, avatar) VALUES (?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, avatar], function(err, results, fields) {
                            connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, avatar=? WHERE email=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, avatar, req.session.user], function(err, results, fields) {
                                connection.release();

                                if (err) {
                                    console.log("Error connecting to the database - update6");
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
            console.log("Error connecting to the database - 7");
            throw err;
        }
        else {
            console.log("Connected to the DB");
            console.log('req.session.id: ' + req.session.userId);

            connection.query('SELECT d.id, d.date, d.userId, o.orderId, SUM(o.price * o.quantity) AS SubTotal, d.tax, d.shipping, u.firstName, u.lastName, u.email FROM orders o INNER JOIN order_details d ON o.orderId = d.id INNER JOIN users u ON d.userId = u.id GROUP BY o.orderId',[],function(err, results, fields) {
                // console.log('Query returned3 ' + JSON.stringify(results));

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
                            curr_date = '0' + curr_date;
                        }
                        if (curr_month < 10) {
                            curr_month = '0' + curr_month;
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
    });
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
                // console.log('Query returned4 ' + JSON.stringify(results));

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
                            curr_date = '0' + curr_date;
                        }
                        if (curr_month < 10) {
                            curr_month = '0' + curr_month;
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
                // console.log('Query returned5 ' + JSON.stringify(results));

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
                // console.log('Query returned6 ' + JSON.stringify(results));

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

                    for (var i=0; i<results.length; i++) {

                        var product = {};

                        var excerptLength = 75;
                        var description = results[i].description;
                        var excerpt = "";

                        if (description.length > excerptLength) {
                            excerpt = description.substring(0,excerptLength).trim() + '...';
                        }
                        else {
                            excerpt = description;
                        }

                        product.id = results[i].id;
                        product.image = results[i].image1;
                        product.title = results[i].title;
                        product.status = results[i].status;
                        product.excerpt = excerpt;

                        console.log(product);
                        productDetails.push(product);
                    }

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

router.get('/dashboard/edit-product/:productId/:title', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var successMsg = req.session.successMsg ? req.session.successMsg : "";
    // var productId = req.session.productId ? req.session.productId : "";
    var title = req.session.title ? req.session.title : "";
    var description = req.session.desc ? req.session.desc : "";
    var image1 = req.session.image1 ? req.session.image1 : "";
    var image2 = req.session.image2 ? req.session.image2 : "";
    var image3 = req.session.image3 ? req.session.image3 : "";
    var image4 = req.session.image4 ? req.session.image4 : "";
    var image5 = req.session.image5 ? req.session.image5 : "";
    var status = req.session.prodstatus ? req.session.prodstatus : "";

    req.session.msg = "";
    req.session.successMsg = "";
    req.session.productId = req.params.productId;
    req.session.title = "";
    req.session.desc = "";
    req.session.image1 = "";
    req.session.image2 = "";
    req.session.image3 = "";
    req.session.image4 = "";
    req.session.image5 = "";
    req.session.prodstatus = "";

    var hide = false;
    var details = [];

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT p.id AS prodId, p.title, p.description, p.image1, p.image2, p.image3, p.image4, p.image5, p.status AS prodStatus, d.id, d.size, d.color, d.stock, d.price, d.status FROM products p INNER JOIN product_details d ON p.id = d.productsId WHERE p.id=?',[req.params.productId],function(err, results, fields) {
                // console.log('Query returned7' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("Product not found");
                }
                // user found
                else {
                    console.log("Product found");

                    title = results[0].title;
                    description = results[0].description;
                    image1 = results[0].image1;
                    image2 = results[0].image2;
                    image3 = results[0].image3;
                    image4 = results[0].image4;
                    image5 = results[0].image5;
                    status = results[0].prodStatus;



                    for (var i=0; i<results.length; i++) {

                        var detail = {};

                        detail.id = results[i].id;
                        detail.size = results[i].size;
                        detail.color = results[i].color;
                        detail.stock = results[i].stock;
                        detail.status = results[i].status;

                        if (results[i].price !== null) {
                            detail.price = results[i].price.toFixed(2);
                        }
                        else {
                            detail.price = results[i].price;
                        }

                        console.log(detail);
                        details.push(detail);
                    }

                    if (results.length === 5) {
                        hide = true;
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
                res.render('dashboard/product', {
                    errorMessage: msg,
                    successMessage: successMsg,
                    access: req.session.user,
                    owner: req.session.admin,
                    products: true,
                    hide: hide,
                    add: false,
                    productId: req.params.productId,
                    title: title,
                    description: description,
                    image1: image1,
                    image2: image2,
                    image3: image3,
                    image4: image4,
                    image5: image5,
                    status: status,
                    details: details
                });
            }
        });
    });
});

router.post('/dashboard/update-product/:productId/:title', productImageUpload.any(), function(req, res, next) {

    console.log("productId " + req.params.productId);
    var productId = req.params.productId;
    var title = req.body.title;
    var description = req.body.description;
    var status = req.body.status;

    var detailId1 = req.body.detailId1;
    var size1 = req.body.size1;
    var color1 = req.body.color1;
    var stock1 = req.body.stock1;
    var price1 = req.body.price1;
    var status1 = req.body.status1;

    var detailId2 = req.body.detailId2;
    var size2 = req.body.size2;
    var color2 = req.body.color2;
    var stock2 = req.body.stock2;
    var price2 = req.body.price2;
    var status2 = req.body.status2;

    var detailId3 = req.body.detailId3;
    var size3 = req.body.size3;
    var color3 = req.body.color3;
    var stock3 = req.body.stock3;
    var price3 = req.body.price3;
    var status3 = req.body.status3;

    var detailId4 = req.body.detailId4;
    var size4 = req.body.size4;
    var color4 = req.body.color4;
    var stock4 = req.body.stock4;
    var price4 = req.body.price4;
    var status4 = req.body.status4;

    var detailId5 = req.body.detailId5;
    var size5 = req.body.size5;
    var color5 = req.body.color5;
    var stock5 = req.body.stock5;
    var price5 = req.body.price5;
    var status5 = req.body.status5;

    if (status === 'active') {
        connect(function(err, connection) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                console.log("Connected to the DB");
                console.log(images);

                connection.query('SELECT * FROM products p INNER JOIN product_details d ON p.id = d.productsId WHERE p.id=?',[req.params.productId],function(err, results, fields) {
                    // console.log('Query returned8 ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    // error - title not entered
                    else if (title.trim().length === 0) {
                        console.log("title field empty.");
                        req.session.msg = "Please enter product title.";
                        res.redirect('/admin/dashboard/edit-product/' + productId + '/' + title);
                    }
                    // error - description not entered
                    else if (description.trim().length === 0) {
                        console.log("description field empty.");
                        req.session.msg = "Please enter product description.";
                        res.redirect('/admin/dashboard/edit-product/' + productId + '/' + title);
                    }
                    else {

                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {
                                console.log("Connected to the DB");

                                var image1 = results[0].image1;
                                var image2 = results[0].image2;
                                var image3 = results[0].image3;
                                var image4 = results[0].image4;
                                var image5 = results[0].image5;

                                if (req.files) {
                                    for (var i=0; i<req.files.length;i++) {
                                        if (req.files[i].fieldname === 'image1') {
                                            image1 = req.files[i].filename;
                                            console.log(image1);
                                        } else if (req.files[i].fieldname === 'image2') {
                                            image2 = req.files[i].filename;
                                            console.log(image2);
                                        } else if (req.files[i].fieldname === 'image3') {
                                            image3 = req.files[i].filename;
                                            console.log(image3);
                                        } else if (req.files[i].fieldname === 'image4') {
                                            image4 = req.files[i].filename;
                                            console.log(image4);
                                        } else {
                                            image5 = req.files[i].filename;
                                            console.log(image5);
                                        }
                                    }
                                }

                                if (!stock1) {
                                    stock1 = null;
                                }
                                if (!stock2 ){
                                    stock2 = null;
                                }
                                if (!stock3) {
                                    stock3 = null;
                                }
                                if (!stock4) {
                                    stock4 = null;
                                }
                                if (!stock5) {
                                    stock5 = null;
                                }

                                if (!status1) {
                                    status1 = 'inactive';
                                }
                                if (!status2 ){
                                    status2 = 'inactive';
                                }
                                if (!status3) {
                                    status3 = 'inactive';
                                }
                                if (!status4) {
                                    status4 = 'inactive';
                                }
                                if (!status5) {
                                    status5 = 'inactive';
                                }

                                // update products
                                connection.query('UPDATE products SET title=?, description=?, image1=?, image2=?, image3=?, image4=?, image5=?, status=? WHERE id=?',[title, description, image1, image2, image3, image4, image5, status, req.params.productId], function(err, results, fields) {

                                    if (err) {
                                        console.log("Error connecting to the database - update1");
                                        throw err;
                                    }
                                    else {
                                        console.log("Product update successful. " + title);

                                        // update product_details - line1
                                        connection.query('UPDATE product_details SET size=?, color=?, stock=?, price=?, status=? WHERE id=? AND productsId=?',[size1, color1, stock1, price1, status1, detailId1, req.params.productId], function(err, results, fields) {
                                            // connection.release();

                                            if (err) {
                                                console.log("Error connecting to the database - update4a");
                                                throw err;
                                            }
                                            else {
                                                console.log("Product detail1 update successful.");
                                            }
                                        });

                                        // update product_details - line2
                                        connection.query('UPDATE product_details SET size=?, color=?, stock=?, price=?, status=? WHERE id=? AND productsId=?',[size2, color2, stock2, price2, status2, detailId2, req.params.productId], function(err, results, fields) {
                                            // connection.release();

                                            if (err) {
                                                console.log("Error connecting to the database - update4b");
                                                throw err;
                                            }
                                            else {
                                                console.log("Product detail2 update successful. ");
                                            }
                                        });

                                        // update product_details - line3
                                        connection.query('UPDATE product_details SET size=?, color=?, stock=?, price=?, status=? WHERE id=? AND productsId=?',[size3, color3, stock3, price3, status3, detailId3, req.params.productId], function(err, results, fields) {
                                            // connection.release();

                                            if (err) {
                                                console.log("Error connecting to the database - update4c");
                                                throw err;
                                            }
                                            else {
                                                console.log("Product detail3 update successful. ");
                                            }
                                        });

                                        // update product_details - line4
                                        connection.query('UPDATE product_details SET size=?, color=?, stock=?, price=?, status=? WHERE id=? AND productsId=?',[size4, color4, stock4, price4, status4, detailId4, req.params.productId], function(err, results, fields) {
                                            // connection.release();

                                            if (err) {
                                                console.log("Error connecting to the database - update4d");
                                                throw err;
                                            }
                                            else {
                                                console.log("Product detail4 update successful. ");
                                            }
                                        });

                                        // update product_details - line5
                                        connection.query('UPDATE product_details SET size=?, color=?, stock=?, price=?, status=? WHERE id=? AND productsId=?',[size5, color5, stock5, price5, status5, detailId5, req.params.productId], function(err, results, fields) {
                                            // connection.release();

                                            if (err) {
                                                console.log("Error connecting to the database - update4e");
                                                throw err;
                                            }
                                            else {
                                                console.log("Product detail5 update successful. ");
                                            }
                                        });
                                    }
                                });
                                connection.commit(function(err) {
                                    connection.release();
                                    if (err) {
                                        connection.rollback(function() {
                                            throw err;
                                        });
                                    }
                                    else{
                                        req.session.successMsg = "Product successfully updated.";
                                        res.redirect('/admin/dashboard/edit-product/' + productId + '/' + title);
                                    }
                                });

                            }
                        });
                    }

                });
            }
        });
    }
    else {
        connect(function(err, connection) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                console.log("Connected to the DB");
                console.log(images);

                connection.query('SELECT * FROM products p INNER JOIN product_details d ON p.id = d.productsId WHERE p.id=?',[req.params.productId],function(err, results, fields) {
                    // console.log('Query returned9 ' + JSON.stringify(results));

                    if(err) {
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

                                // update products
                                connection.query('UPDATE products SET status=? WHERE id=?',[status, req.params.productId], function(err, results, fields) {

                                    if (err) {
                                        console.log("Error connecting to the database - update1");
                                        throw err;
                                    }
                                    else {
                                        console.log("Product update successful. " + title);
                                    }
                                });
                                connection.commit(function(err) {
                                    connection.release();
                                    if (err) {
                                        connection.rollback(function() {
                                            throw err;
                                        });
                                    }
                                    else{
                                        req.session.successMsg = "Product successfully updated.";
                                        res.redirect('/admin/dashboard/edit-product/' + productId + '/' + title);
                                    }
                                });

                            }
                        });
                    }

                });
            }
        });
    }
});

router.get('/dashboard/add-new-product', function(req, res, next) {

    var msg = req.session.msg = "";
    var title = req.session.title = "";
    var description = req.session.desc = "";
    var image1 = req.session.image1 = "";
    var image2 = req.session.image2 = "";
    var image3 = req.session.image3 = "";
    var image4 = req.session.image4 = "";
    var image5 = req.session.image5 = "";
    var status = req.session.prodstatus = "";

    var size1 = req.session.size1 = "";
    var color1 = req.session.color1 = "";
    var stock1 = req.session.stock1 = "";
    var price1 = req.session.price1 = "";
    var status1 = req.session.status1 = "";

    var size2 = req.session.size2 = "";
    var color2 = req.session.color2 = "";
    var stock2 = req.session.stock2 = "";
    var price2 = req.session.price2 = "";
    var status2 = req.session.status2 = "";

    var size3 = req.session.size3 = "";
    var color3 = req.session.color3 = "";
    var stock3 = req.session.stock3 = "";
    var price3 = req.session.price3 = "";
    var status3 = req.session.status3 = "";

    var size4 = req.session.size4 = "";
    var color4 = req.session.color4 = "";
    var stock4 = req.session.stock4 = "";
    var price4 = req.session.price4 = "";
    var status4 = req.session.status4 = "";

    var size5 = req.session.size5 = "";
    var color5 = req.session.color5 = "";
    var stock5 = req.session.stock5 = "";
    var price5 = req.session.price5 = "";
    var status5 = req.session.status5 = "";

    res.redirect('/admin/dashboard/add-product');
});

router.get('/dashboard/add-product', function(req, res, next) {

    var details = "";

    var msg = req.session.msg ? req.session.msg : "";
    var successMsg = req.session.successMsg ? req.session.successMsg : "";
    // var productId = req.session.productId ? req.session.productId : "";
    var title = req.session.title ? req.session.title : "";
    var description = req.session.desc ? req.session.desc : "";
    var image1 = req.session.image1 ? req.session.image1 : "";
    var image2 = req.session.image2 ? req.session.image2 : "";
    var image3 = req.session.image3 ? req.session.image3 : "";
    var image4 = req.session.image4 ? req.session.image4 : "";
    var image5 = req.session.image5 ? req.session.image5 : "";
    var status = req.session.prodstatus ? req.session.prodstatus : "";

    var size1 = req.session.size1 ? req.session.size1 : "";
    var color1 = req.session.color1 ? req.session.color1 : "";
    var stock1 = req.session.stock1 ? req.session.stock1 : "";
    var price1 = req.session.price1 ? req.session.price1 : "";
    var status1 = req.session.status1 ? req.session.status5 : "";

    var size2 = req.session.size2 ? req.session.size2 : "";
    var color2 = req.session.color2 ? req.session.color2 : "";
    var stock2 = req.session.stock2 ? req.session.stock2 : "";
    var price2 = req.session.price2 ? req.session.price2 : "";
    var status2 = req.session.status2 ? req.session.status2 : "";

    var size3 = req.session.size3 ? req.session.size3 : "";
    var color3 = req.session.color3 ? req.session.color3 : "";
    var stock3 = req.session.stock3 ? req.session.stock3 : "";
    var price3 = req.session.price3 ? req.session.price3 : "";
    var status3 = req.session.status3 ? req.session.status3 : "";

    var size4 = req.session.size4 ? req.session.size4 : "";
    var color4 = req.session.color4 ? req.session.color4 : "";
    var stock4 = req.session.stock4 ? req.session.stock4 : "";
    var price4 = req.session.price4 ? req.session.price4 : "";
    var status4 = req.session.status4 ? req.session.status4 : "";

    var size5 = req.session.size5 ? req.session.size5 : "";
    var color5 = req.session.color5 ? req.session.color5 : "";
    var stock5 = req.session.stock5 ? req.session.stock5 : "";
    var price5 = req.session.price5 ? req.session.price5 : "";
    var status5 = req.session.status5 ? req.session.status5 : "";

    req.session.msg = "";
    req.session.successMsg = "";
    req.session.productId = req.params.productId;
    req.session.prodtitle = "";
    req.session.proddesc = "";
    req.session.image1 = "";
    req.session.image2 = "";
    req.session.image3 = "";
    req.session.image4 = "";
    req.session.image5 = "";
    req.session.prodstatus = "";

    req.session.size1 = "";
    req.session.color1 = "";
    req.session.stock1 = "";
    req.session.price1 = "";
    req.session.status1 = "";

    req.session.size2 = "";
    req.session.color2 = "";
    req.session.stock2 = "";
    req.session.price2 = "";
    req.session.status2 = "";

    req.session.size3 = "";
    req.session.color3 = "";
    req.session.stock3 = "";
    req.session.price3 = "";
    req.session.status3 = "";

    req.session.size4 = "";
    req.session.color4 = "";
    req.session.stock4 = "";
    req.session.price4 = "";
    req.session.status4 = "";

    req.session.size5 = "";
    req.session.color5 = "";
    req.session.stock5 = "";
    req.session.price5 = "";
    req.session.status5 = "";

    res.render('dashboard/product', {
        errorMessage: msg,
        access: req.session.user,
        owner: req.session.admin,
        productData: productData,
        products: true,
        details: details,
        add: true,
        title: title,
        description: description,
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5,
        status: status,
        size1: size1,
        color1: color1,
        stock1: stock1,
        price1: price1,
        status1: status1,
        size2: size2,
        color2: color2,
        stock2: stock2,
        price2: price2,
        status2: status2,
        size3: size3,
        color3: color3,
        stock3: stock3,
        price3: price3,
        status3: status3,
        size4: size4,
        color4: color4,
        stock4: stock4,
        price4: price4,
        status4: status4,
        size5: size5,
        color5: color5,
        stock5: stock5,
        price5: price5,
        status5: status5
    });
});

router.post('/dashboard/save-product', productImageUpload.any(), function(req, res, next) {

    var productId = req.params.id;
    var title = req.body.title;
    var description = req.body.description;
    var image1;
    var image2;
    var image3;
    var image4;
    var image5;
    var status = req.body.status;

    var detailId1 = '';
    var size1 = req.body.size1;
    var color1 = req.body.color1;
    var stock1 = req.body.stock1;
    var price1 = req.body.price1;
    var status1 = req.body.status1;

    var detailId2 = '';
    var size2 = req.body.size2;
    var color2 = req.body.color2;
    var stock2 = req.body.stock2;
    var price2 = req.body.price2;
    var status2 = req.body.status2;

    var detailId3 = '';
    var size3 = req.body.size3;
    var color3 = req.body.color3;
    var stock3 = req.body.stock3;
    var price3 = req.body.price3;
    var status3 = req.body.status3;

    var detailId4 = '';
    var size4 = req.body.size4;
    var color4 = req.body.color4;
    var stock4 = req.body.stock4;
    var price4 = req.body.price4;
    var status4 = req.body.status4;

    var detailId5 = '';
    var size5 = req.body.size5;
    var color5 = req.body.color5;
    var stock5 = req.body.stock5;
    var price5 = req.body.price5;
    var status5 = req.body.status5;

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            // error - title not entered
            if (title.trim().length === 0) {
                console.log("title field empty.");
                req.session.msg = "Please enter title.";
                // req.session.title = title;
                req.session.desc = description;
                req.session.image1 = image1;
                req.session.image2 = image2;
                req.session.image3 = image3;
                req.session.image4 = image4;
                req.session.image5 = image5;
                req.session.status = status;

                req.session.size1 = size1;
                req.session.color1 = color1;
                req.session.stock1 = stock1;
                req.session.price1 = price1;
                req.session.status1 = status1;

                req.session.size2 = size2;
                req.session.color2 = color2;
                req.session.stock2 = stock2;
                req.session.price2 = price2;
                req.session.status2 = status2;

                req.session.size3 = size3;
                req.session.color3 = color3;
                req.session.stock3 = stock3;
                req.session.price3 = price3;
                req.session.status3 = status3;

                req.session.size4 = size4;
                req.session.color4 = color4;
                req.session.stock4 = stock4;
                req.session.price4 = price4;
                req.session.status4 = status4;

                req.session.size5 = size5;
                req.session.color5 = color5;
                req.session.stock5 = stock5;
                req.session.price5 = price5;
                req.session.status5 = status5;

                res.redirect('/admin/dashboard/add-product');
            }
            else {
                console.log("Connected to the DB");
                connection.query('SELECT * FROM products WHERE title=? AND status="active"' ,[title],function(err, results, fields) {
                    // console.log('Query returned10 ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    else if (results.length !== 0) {
                        console.log("Title in use - save");
                        req.session.msg = "Unable to add project. Title already in use.";
                        req.session.desc = description;
                        req.session.image1 = image1;
                        req.session.image2 = image2;
                        req.session.image3 = image3;
                        req.session.image4 = image4;
                        req.session.image5 = image5;
                        req.session.status = status;

                        req.session.size1 = size1;
                        req.session.color1 = color1;
                        req.session.stock1 = stock1;
                        req.session.price1 = prcie1;
                        req.session.status1 = status1;

                        req.session.size2 = size2;
                        req.session.color2 = color2;
                        req.session.stock2 = stock2;
                        req.session.price2 = price2;
                        req.session.status2 = status2;

                        req.session.size3 = size3;
                        req.session.color3 = color3;
                        req.session.stock3 = stock3;
                        req.session.price3 = price3;
                        req.session.status3 = status3;

                        req.session.size4 = size4;
                        req.session.color4 = color4;
                        req.session.stock4 = stock4;
                        req.session.price4 = price4;
                        req.session.status4 = status4;

                        req.session.size5 = size5;
                        req.session.color5 = color5;
                        req.session.stock5 = stock5;
                        req.session.price5 = price5;
                        req.session.status5 = status5;

                        res.redirect('/admin/dashboard/add-product');
                    }
                    else {
                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {
                                console.log("Connected to the DB");

                                if (req.files) {
                                    for (var i=0; i<req.files.length;i++) {
                                        if (req.files[i].fieldname === 'image1') {
                                            image1 = req.files[i].filename;
                                            console.log(image1);
                                        } else if (req.files[i].fieldname === 'image2') {
                                            image2 = req.files[i].filename;
                                            console.log(image2);
                                        } else if (req.files[i].fieldname === 'image3') {
                                            image3 = req.files[i].filename;
                                            console.log(image3);
                                        } else if (req.files[i].fieldname === 'image4') {
                                            image4 = req.files[i].filename;
                                            console.log(image4);
                                        } else {
                                            image5 = req.files[i].filename;
                                            console.log(image5);
                                        }
                                    }
                                }

                                connection.query('INSERT INTO products (title, description, image1, image2, image3, image4, image5, status) VALUES (?,?,?,?,?,?,?,?)',[title, description, image1, image2, image3, image4, image5, status], function(err, results, fields) {

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

                                                connection.query('SELECT * FROM products WHERE title=?',[title],function(err, results, fields) {
                                                    // connection.release();
                                                    // console.log('Query returned11 ' + JSON.stringify(results));

                                                    if(err) {
                                                        throw err;
                                                    }
                                                    // no user found
                                                    else if (results.length === 0) {
                                                        console.log("Product not found");
                                                    }
                                                    // user found
                                                    else {
                                                        productId = results[0].id;
                                                        title = results[0].title;

                                                        if (!stock1) {
                                                            stock1 = null;
                                                        }
                                                        if (!stock2 ){
                                                            stock2 = null;
                                                        }
                                                        if (!stock3) {
                                                            stock3 = null;
                                                        }
                                                        if (!stock4) {
                                                            stock4 = null;
                                                        }
                                                        if (!stock5) {
                                                            stock5 = null;
                                                        }

                                                        if (!status1) {
                                                            status1 = 'inactive';
                                                        }
                                                        if (!status2 ){
                                                            status2 = 'inactive';
                                                        }
                                                        if (!status3) {
                                                            status3 = 'inactive';
                                                        }
                                                        if (!status4) {
                                                            status4 = 'inactive';
                                                        }
                                                        if (!status5) {
                                                            status5 = 'inactive';
                                                        }

                                                        connect(function(err, connection) {
                                                            if (err) {
                                                                console.log("Error connecting to the database");
                                                                throw err;
                                                            }
                                                            else {
                                                                console.log("Connected to the DB");

                                                                connection.query('INSERT INTO product_details (productsId, size, color, stock, price, status) VALUES (?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?),(?,?,?,?,?,?)',
                                                                    [productId, size1, color1, stock1, price1, status1, productId, size2, color2, stock2, price2, status2, productId, size3, color3, stock3, price3, status3, productId, size4, color4, stock4, price4, status4, productId, size5, color5, stock5, price5, status5], function(err, results, fields) {
                                                                    // connection.release();

                                                                    if(err) {
                                                                        throw err;
                                                                    }
                                                                    // no user found
                                                                    else if (results.length === 0) {
                                                                        console.log("Product not found");
                                                                    }
                                                                    // user found
                                                                    else {
                                                                        req.session.successMsg = "Successfully added products ";
                                                                        console.log("Products inserted successful. ");
                                                                        res.redirect('/admin/dashboard/edit-product/' + productId + '/' + title);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
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




router.get('/dashboard/users', function(req, res, next) {

    var userDetails = [];

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email != ? ORDER BY id',[req.session.user],function(err, results, fields) {
                // console.log('Query returned12 ' + JSON.stringify(results));

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
    var userAvatar = req.session.userAvatar ? req.session.userAvatar : "";
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
    req.session.userAvatar = "";
    req.session.userType = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE id = ?',[req.params.id],function(err, results, fields) {
                // console.log('Query returned13 ' + JSON.stringify(results));

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
                    userAvatar = req.session.userAvatar = results[0].avatar;
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
                if (req.params.email !== req.session.user) {
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
                        userAvatar: userAvatar,
                        userType: userType
                    });
                } else {
                    res.redirect('/admin/dashboard/users');
                }
            }
        });
    });
});


router.post('/dashboard/update-user/:id/:email', function(req, res, next) {

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
    var userAvatar;
    var userType = req.body.userType;


    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            // connection.query('SELECT * FROM users WHERE id=? AND email=?',[req.params.id, req.params.email],function(err, results, fields) {
            connection.query('SELECT * FROM users WHERE id=?',[req.params.id],function(err, results, fields) {
                // console.log('Query returned14 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // error - email not entered
                if (email.trim().length === 0) {
                    console.log("email field empty.");
                    req.session.msg = "Please enter email.";
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + req.params.email);
                }
                // error - firstname not entered
                else if (firstName.trim().length === 0) {
                    console.log("firstName field empty.");
                    req.session.msg = "Please enter Firstname.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - lastname not entered
                else if (lastName.trim().length === 0) {
                    console.log("lastName field empty.");
                    req.session.msg = "Please enter Lastname.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - new password empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0)) {
                    console.log("new password field empty.");
                    req.session.msg = "New password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }
                // error - confirm password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0)) {
                    console.log("re-enter password field empty.");
                    req.session.msg = "Confirm password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + email);
                }

                // error - email already registered
                else if ((results.length !== 0) && (email.trim() !== req.params.email)) {
                    console.log("email: " + email + " results: " + results[0].email + " params: " + req.params.email);

                    connect(function(err, connection) {
                        if (err) {
                            console.log("Error connecting to the database");
                            throw err;
                        }
                        else {
                            connection.query('SELECT * FROM users WHERE email=?',[email],function(err, results, fields) {
                                // console.log('Query returned15 ' + JSON.stringify(results));

                                if(err) {
                                    throw err;
                                }
                                else if (results.length !== 0) {
                                    console.log("Email already registered - update user");
                                    req.session.msg = "Unable to update. Email address already registered.";
                                    res.redirect('/admin/dashboard/edit-user/' + userId + '/' + req.params.email);
                                }
                                // okay - all password filds entered
                                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0)) {
                                    // error - new and confirm do not match
                                    if (password1.trim() !== password2.trim()) {
                                        console.log("new and confirm passwords does not match.");
                                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
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
                                                connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, password=?, WHERE id=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, password1, req.params.id], function(err, results, fields) {
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
                                            connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, userType=? WHERE id=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, userType, req.params.id], function(err, results, fields) {
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
                }

                // okay - all password filds entered
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0)) {
                    // error - new and confirm do not match
                    if (password1.trim() !== password2.trim()) {
                        console.log("new and confirm passwords does not match.");
                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
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
                                connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=?, password=? WHERE id=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, password1, req.params.id], function(err, results, fields) {
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
                            connection.query('UPDATE users SET firstName=?, lastName=?, address1=?, address2=?, city=?, province=?, postalcode=?, country=?, email=?, phoneNumber=? WHERE id=?',[firstName, lastName, address1, address2, city, province, postalcode, country, email, phoneNumber, req.params.id], function(err, results, fields) {
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
            connection.commit(function(err) {
                connection.release();
                if (err) {
                    connection.rollback(function() {
                        throw err;
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
    var userAvatar = req.session.userAvatar = "";
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
    var avatar;
    var userAvatar = req.session.userAvatar ? req.session.userAvatar : "";
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
    req.session.userAvatar = "";
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
        userAvatar: userAvatar,
        userType: userType
    });
});

router.post('/dashboard/save-user', avatarUpload.single('avatar'), function(req, res, next) {

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
                    // console.log('Query returned16 ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    else if (results.length !== 0) {
                        console.log("Email already registered - save");
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

                                        connection.query('INSERT INTO users (firstName, lastName, address1, address2, city, province, postalcode, country, email, password, userType) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[firstName, lastName, address1, address2, city, province, postalcode, country, email, password1, userType], function(err, results, fields) {

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
                                                            // console.log('Query returned17 ' + JSON.stringify(results));

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

router.get('/dashboard/settings', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var successMsg = req.session.successMsg ? req.session.successMsg : "";

    var logo = req.session.logo ? req.session.logo : "";
    var color1 = req.session.color1 ? req.session.color1 : "";
    var color2 = req.session.color2 ? req.session.color2 : "";
    var color3 = req.session.color3 ? req.session.color3 : "";
    var font1 = req.session.font1 ? req.session.font1 : "";
    var font2 = req.session.font2 ? req.session.font2 : "";
    var font3 = req.session.font3 ? req.session.font3 : "";

    var sliderTitle1 = req.session.sliderTitle1 ? req.session.sliderTitle1 : "";
    var sliderDescription1 = req.session.sliderDescription1 ? req.session.sliderDescription1 : "";
    var sliderUrl1 = req.session.sliderUrl1 ? req.session.sliderUrl1 : "";
    var sliderImage1 = req.session.sliderImage1 ? req.session.sliderImage1 : "";

    var sliderTitle2 = req.session.sliderTitle2 ? req.session.sliderTitle2 : "";
    var sliderDescription2 = req.session.sliderDescription2 ? req.session.sliderDescription2 : "";
    var sliderUrl2 = req.session.sliderUrl2 ? req.session.sliderUrl2 : "";
    var sliderImage2 = req.session.sliderImage2 ? req.session.sliderImage2 : "";

    var sliderTitle3 = req.session.sliderTitle3 ? req.session.sliderTitle3 : "";
    var sliderDescription3 = req.session.sliderDescription3 ? req.session.sliderDescription3 : "";
    var sliderUrl3 = req.session.sliderUrl3 ? req.session.sliderUrl3 : "";
    var sliderImage3 = req.session.sliderImage3 ? req.session.sliderImage3 : "";

    var ctaTitle1 = req.session.ctaTitle1 ? req.session.ctaTitle1 : "";
    var ctaSubtitle1 = req.session.ctaSubtitle1 ? req.session.ctaSubtitle1 : "";
    var ctaDescription1 = req.session.ctaDescription1 ? req.session.ctaDescription1 : "";

    var ctaTitle2 = req.session.ctaTitle2 ? req.session.ctaTitle2 : "";
    var ctaSubtitle2 = req.session.ctaSubtitle2 ? req.session.ctaSubtitle2 : "";
    var ctaDescription2 = req.session.ctaDescription2 ? req.session.ctaDescription2 : "";

    var ctaTitle3 = req.session.ctaTitle3 ? req.session.ctaTitle3 : "";
    var ctaSubtitle3 = req.session.ctaSubtitle3 ? req.session.ctaSubtitle3 : "";
    var ctaDescription3 = req.session.ctaDescription3 ? req.session.ctaDescription3 : "";

    var aboutDescription = req.session.aboutDescription ? req.session.aboutDescription : "";
    var companyName = req.session.companyName ? req.session.companyName : "";
    var companyUrl = req.session.companyUrl ? req.session.companyUrl : "";
    var contactName = req.session.contactName ? req.session.contactName : "";
    var contactEmail = req.session.contactEmail ? req.session.contactEmail : "";
    var facebook = req.session.facebook ? req.session.facebook : "";
    var twitter = req.session.twitter ? req.session.twitter : "";

    req.session.msg = "";
    req.session.successMsg = "";

    req.session.logo = "";
    req.session.color1 = "";
    req.session.color2 = "";
    req.session.color3 = "";
    req.session.font1 = "";
    req.session.font2 = "";
    req.session.font3 = "";

    req.session.sliderTitle1 = "";
    req.session.sliderDescription1 = "";
    req.session.sliderUrl1 = "";
    req.session.sliderImage1 = "";

    req.session.sliderTitle2 = "";
    req.session.sliderDescription2 = "";
    req.session.sliderUrl2 = "";
    req.session.sliderImage2 = "";

    req.session.sliderTitle3 = "";
    req.session.sliderDescription3 = "";
    req.session.sliderUrl3 = "";
    req.session.sliderImage3 = "";

    req.session.ctaTitle1 = "";
    req.session.ctaSubtitle1 = "";
    req.session.ctaDescription1 = "";

    req.session.ctaTitle2 = "";
    req.session.ctaSubtitle2 = "";
    req.session.ctaDescription2 = "";

    req.session.ctaTitle3 = "";
    req.session.ctaSubtitle3 = "";
    req.session.ctaDescription3 = "";

    req.session.aboutDescription = "";
    req.session.companyName = "";
    req.session.companyUrl = "";
    req.session.contactName = "";
    req.session.contactEmail = "";
    req.session.facebook = "";
    req.session.twitter = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM settings ORDER BY id DESC',[],function(err, results, fields) {
                // console.log('Query returned18 ' + JSON.stringify(results));

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

                    logo = req.session.logo = results[0].logo;
                    color1 = req.session.color1 = results[0].color1;
                    color2 = req.session.color2 = results[0].color2;
                    color3 = req.session.color3 = results[0].color3;

                    font1 = req.session.font1 = results[0].font1;
                    font2 = req.session.font2 = results[0].font2;
                    font3 = req.session.font3 = results[0].font3;

                    sliderTitle1 = req.session.sliderTitle1 = results[0].sliderTitle1;
                    sliderDescription1 = req.session.sliderDescription1 = results[0].sliderDescription1;
                    sliderUrl1 = req.session.sliderUrl1 = results[0].sliderUrl1;
                    sliderImage1 = req.session.sliderImage1 = results[0].sliderImage1;

                    sliderTitle2 = req.session.sliderTitle2 = results[0].sliderTitle2;
                    sliderDescription2 = req.session.sliderDescription2 = results[0].sliderDescription2;
                    sliderUrl2 = req.session.sliderUrl2 = results[0].sliderUrl2;
                    sliderImage2 = req.session.sliderImage2 = results[0].sliderImage2;

                    sliderTitle3 = req.session.sliderTitle3 = results[0].sliderTitle3;
                    sliderDescription3 = req.session.sliderDescription3 = results[0].sliderDescription3;
                    sliderUrl3 = req.session.sliderUrl3 = results[0].sliderUrl3;
                    sliderImage3 = req.session.sliderImage3 = results[0].sliderImage3;

                    ctaTitle1 = req.session.ctaTitle1 = results[0].ctaTitle1;
                    ctaSubtitle1 = req.session.ctaSubtitle1 = results[0].ctaSubtitle1;
                    ctaDescription1 = req.session.ctaDescription1 = results[0].ctaDescription1;

                    ctaTitle2 = req.session.ctaTitle2 = results[0].ctaTitle2;
                    ctaSubtitle2 = req.session.ctaSubtitle2 = results[0].ctaSubtitle2;
                    ctaDescription2 = req.session.ctaDescription2 = results[0].ctaDescription2;

                    ctaTitle3 = req.session.ctaTitle3 = results[0].ctaTitle3;
                    ctaSubtitle3 = req.session.ctaSubtitle3 = results[0].ctaSubtitle3;
                    ctaDescription3 = req.session.ctaDescription3 = results[0].ctaDescription3;

                    aboutDescription = req.session.aboutDescription = results[0].aboutDescription;

                    companyName = req.session.companyName = results[0].companyName;
                    companyUrl = req.session.companyUrl = results[0].companyUrl;
                    contactName = req.session.contactName = results[0].contactName;
                    contactEmail = req.session.contactEmail = results[0].contactEmail;

                    facebook = req.session.facebook = results[0].facebook;
                    twitter = req.session.twitter = results[0].twitter;

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
                res.render('dashboard/settings', {
                    errorMessage: msg,
                    access: req.session.user,
                    owner: req.session.admin,
                    eSettings: true,
                    userId: userId,
                    logo: logo,
                    color1: color1,
                    color2: color2,
                    color3: color3,
                    font1: font1,
                    font2: font2,
                    font3: font3,
                    sliderTitle1: sliderTitle1,
                    sliderDescription1: sliderDescription1,
                    sliderUrl1: sliderUrl1,
                    sliderImage1: sliderImage1,
                    sliderTitle2: sliderTitle2,
                    sliderDescription2: sliderDescription2,
                    sliderUrl2: sliderUrl2,
                    sliderImage2: sliderImage2,
                    sliderTitle3: sliderTitle3,
                    sliderDescription3: sliderDescription3,
                    sliderUrl3: sliderUrl3,
                    sliderImage3: sliderImage3,
                    ctaTitle1: ctaTitle1,
                    ctaSubtitle1: ctaSubtitle1,
                    ctaDescription1: ctaDescription1,
                    ctaTitle2: ctaTitle2,
                    ctaSubtitle2: ctaSubtitle2,
                    ctaDescription2: ctaDescription2,
                    ctaTitle3: ctaTitle3,
                    ctaSubtitle3: ctaSubtitle3,
                    ctaDescription3: ctaDescription3,
                    aboutDescription: aboutDescription,
                    companyName: companyName,
                    companyUrl: companyUrl,
                    contactName: contactName,
                    contactEmail: contactEmail,
                    facebook: facebook,
                    twitter: twitter
                });
            }
        });
    });
});

router.post('/dashboard/update-settings', settingsImageUpload.any(), function(req, res, next) {

    var color1 = req.body.color1;
    var color2 = req.body.color2;
    var color3 = req.body.color3;

    var sliderTitle1 = req.body.sliderTitle1;
    var sliderDescription1 = req.body.sliderDescription1;
    var sliderUrl1 = req.body.sliderUrl1;

    var sliderTitle2 = req.body.sliderTitle2;
    var sliderDescription2 = req.body.sliderDescription2;
    var sliderUrl2 = req.body.sliderUrl2;

    var sliderTitle3 = req.body.sliderTitle3;
    var sliderDescription3 = req.body.sliderDescription3;
    var sliderUrl3 = req.body.sliderUrl3;

    var ctaTitle1 = req.body.ctaTitle1;
    var ctaSubtitle1 = req.body.ctaSubtitle1;
    var ctaDescription1 = req.body.ctaDescription1;

    var ctaTitle2 = req.body.ctaTitle2;
    var ctaSubtitle2 = req.body.ctaSubtitle2;
    var ctaDescription2 = req.body.ctaDescription2;

    var ctaTitle3 = req.body.ctaTitle3;
    var ctaSubtitle3 = req.body.ctaSubtitle3;
    var ctaDescription3 = req.body.ctaDescription3;

    var aboutDescription = req.body.aboutDescription;

    var companyName = req.body.companyName;
    var companyUrl = req.body.companyUrl;
    var contactName = req.body.contactName;
    var contactEmail = req.body.contactEmail;

    var facebook = req.body.facebook;
    var twitter = req.body.twitter;

    var font1 = '';
    var font2 = '';
    var font3 = '';

    var c1 = color1.substring(1);   // strip #
    var rgb1 = parseInt(c1, 16);     // convert rrggbb to decimal
    var r1 = (rgb1 >> 16) & 0xff;    // extract red
    var g1 = (rgb1 >>  8) & 0xff;    // extract green
    var b1 = (rgb1 >>  0) & 0xff;    // extract blue
    // var luma1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1; // per ITU-R BT.709
    // var luma1 = (r1 + g1 + b1)/3;

    var c2 = color2.substring(1);   // strip #
    var rgb2 = parseInt(c2, 16);     // convert rrggbb to decimal
    var r2 = (rgb2 >> 16) & 0xff;    // extract red
    var g2 = (rgb2 >>  8) & 0xff;    // extract green
    var b2 = (rgb2 >>  0) & 0xff;    // extract blue
    // var luma2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2; // per ITU-R BT.709
    // var luma2 = (r2 + g2 + b2)/3;

    var c3 = color3.substring(1);   // strip #
    var rgb3 = parseInt(c3, 16);     // convert rrggbb to decimal
    var r3 = (rgb3 >> 16) & 0xff;    // extract red
    var g3 = (rgb3 >>  8) & 0xff;    // extract green
    var b3 = (rgb3 >>  0) & 0xff;    // extract blue
    // var luma3 = 0.2126 * r3 + 0.7152 * g3 + 0.0722 * b3; // per ITU-R BT.709
    // var luma3 = (r3 + g3 + b3)/3;

    var luma1 = Math.sqrt(0.241 * Math.pow(r1, 2) +
        0.691 * Math.pow(g1, 2) +
        0.068 * Math.pow(b1, 2));

    var luma2 = Math.sqrt(0.241 * Math.pow(r2, 2) +
        0.691 * Math.pow(g2, 2) +
        0.068 * Math.pow(b2, 2));

    var luma3 = Math.sqrt(0.241 * Math.pow(r3, 2) +
        0.691 * Math.pow(g3, 2) +
        0.068 * Math.pow(b3, 2));


    if (luma1 < 190) {
        font1 = '#FFFFFF';
    }
    else {
        font1 = '#000000';
    }

    if (luma2 < 190) {
        font2 = '#FFFFFF';
    }
    else {
        font2 = '#000000';
    }

    if (luma3 < 190) {
        font3 = '#FFFFFF';
    }
    else {
        font3 = '#000000';
    }

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
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

                    var logo = req.session.logo;
                    var sliderImage1 = req.session.sliderImage1;
                    var sliderImage2 = req.session.sliderImage2;
                    var sliderImage3 = req.session.sliderImage3;

                    if (req.files) {
                        for (var i=0; i<req.files.length;i++) {
                            if (req.files[i].fieldname === 'logo') {
                                logo = req.files[i].filename;
                            } else if (req.files[i].fieldname === 'sliderImage1') {
                                sliderImage1 = req.files[i].filename;
                            } else if (req.files[i].fieldname === 'sliderImage2') {
                                sliderImage2 = req.files[i].filename;
                            } else {
                                sliderImage3 = req.files[i].filename;
                            }
                        }
                    }

                    var sql = 'INSERT INTO settings (logo, color1, color2, color3, ' +
                        'font1, font2, font3, ' +
                        'sliderTitle1, sliderDescription1, sliderUrl1, sliderImage1, ' +
                        'sliderTitle2, sliderDescription2, sliderUrl2, sliderImage2, ' +
                        'sliderTitle3, sliderDescription3, sliderUrl3, sliderImage3, ' +
                        'ctaTitle1, ctaSubtitle1, ctaDescription1, ' +
                        'ctaTitle2, ctaSubtitle2, ctaDescription2, ' +
                        'ctaTitle3, ctaSubtitle3, ctaDescription3, ' +
                        'aboutDescription, companyName, companyUrl, contactName, contactEmail, ' +
                        'facebook, twitter) ' +
                        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                    connection.query(sql, [logo, color1, color2, color3, font1, font2, font3, sliderTitle1, sliderDescription1, sliderUrl1, sliderImage1, sliderTitle2, sliderDescription2, sliderUrl2, sliderImage2, sliderTitle3, sliderDescription3, sliderUrl3, sliderImage3, ctaTitle1, ctaSubtitle1, ctaDescription1, ctaTitle2, ctaSubtitle2, ctaDescription2, ctaTitle3, ctaSubtitle3, ctaDescription3, aboutDescription, companyName, companyUrl, contactName, contactEmail, facebook, twitter],
                        function(err, results, fields) {
                        if (err) {
                            console.log("Error connecting to the database - insert46");
                            throw err;
                        }
                        else {
                            connection.query('SELECT * FROM settings ORDER BY id DESC',[],function(err, results, fields) {
                                connection.release();
                                // console.log('Query returned19 ' + JSON.stringify(results[0]));
                                if(err) {
                                    throw err;
                                } else {
                                    console.log("User update successful. ");
                                    req.session.themeSettings = results[0];
                                    // req.session.user = email;
                                    res.redirect('/admin/dashboard/settings');
                                    // res.redirect('/admin-session');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
