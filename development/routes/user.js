var express = require('express');
var router = express.Router();
var connect = require('../database/connect');
var multer = require('multer');
var nodemailer = require('nodemailer');
require('dotenv').config();

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

router.post('/add-to-cart', function(req, res, next) {

    var email = req.session.user;
    var detailId = req.body.attributes;
    var quantity = req.body.quantity;
    var productId = req.session.productId;
    var title = req.session.title;

    var msg = req.session.msg ? req.session.msg : "";
    var successMsg = req.session.successMsg ? req.session.successMsg : "";

    req.session.msg = "";
    req.session.successMsg = "";


    console.log('productId ' + productId);

    if (!email) {
        console.log("login needed");
        req.session.msg = "Please login or register.";
        res.redirect('/admin/dashboard/profile');
    }
    else {
        connect(function(err, connection) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                console.log(email + ' ' + detailId + '' + quantity);
                console.log("Connected to the DB");

                connection.query('SELECT * FROM shopping_cart WHERE email=? AND detailId=?',[email, detailId],function(err, results, fields) {
                    // console.log('Query returned2 ' + JSON.stringify(results));

                    if(err) {
                        throw err;
                    }
                    // error - product already in cart for user
                    else if (results.length !== 0) {
                        console.log("Product already exists in cart");
                        req.session.msg = "Product already exists in cart.";
                        req.session.user = email;
                        res.redirect('/product/' + productId + '/' + title);
                    }

                    else {

                        connect(function(err, connection) {
                            if (err) {
                                console.log("Error connecting to the database");
                                throw err;
                            }
                            else {
                                console.log("Connected to the DB");

                                // insert product to shopping-cart
                                connection.query('INSERT INTO shopping_cart (email, detailId, quantity) VALUES (?,?,?)',[email, detailId, quantity], function(err, results, fields) {
                                    connection.release();

                                    if (err) {
                                        console.log("Error connecting to the database - update1**");
                                        throw err;
                                    }
                                    else {
                                        console.log("Product successfully inserted into cart for " + email);
                                        req.session.successMsg = "Product(s) successfully added to cart.";
                                        req.session.user = email;
                                        res.redirect('/product/' + productId + '/' + title);
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


router.get('/shopping-cart', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    var successMsg = req.session.successMsg ? req.session.successMsg : "";
    var email = req.session.user;
    var cart = '';
    var cartDetail = {};

    req.session.msg = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");
            connection.query('SELECT s.id, s.email, s.detailId, s.quantity, d.productsId, d.size, d.color, d.price, p.title, p.description, p.image1 FROM shopping_cart s INNER JOIN product_details d ON s.detailId = d.id INNER JOIN products p ON d.productsId = p.id WHERE s.email=?',[email], function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                  throw err;
                }
                // no items in cart found
                else if (results.length === 0) {
                  console.log("no items in cart");
                }
                // items in cart found
                else {
                    console.log("items in cart found for" + email);

                    var taxrate = 0.135;
                    var shipping = 10;
                    var subtotal = 0;
                    var tax = 0;
                    var total = 0;

                    for (var i=0; i<results.length; i++) {
                        var excerptLength = 75;
                        var description = results[i].description;
                        var excerpt = "";
                        var linetotal = 0;

                        if (description.length > excerptLength) {
                          excerpt = description.substring(0,excerptLength).trim() + '...';
                        }
                        else {
                          excerpt = description;
                        }

                        results[i].excerpt = excerpt;

                        results[i].price = results[i].price.toFixed(2);

                        linetotal = results[i].price * results[i].quantity;

                        results[i].subtotal = linetotal.toFixed(2);

                        subtotal = subtotal + linetotal;
                    }

                    cart = results;
                    console.log('cart ' + JSON.stringify(cart));

                    tax = subtotal * taxrate;
                    total = subtotal + tax + shipping;

                    cartDetail.tax = tax.toFixed(2);
                    cartDetail.shipping = shipping.toFixed(2);
                    cartDetail.subtotal = subtotal.toFixed(2);
                    cartDetail.total = total.toFixed(2);

                    console.log('cartDetail ' + JSON.stringify(cartDetail));
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
                res.render('shopping-cart', {
                    errorMessage: msg,
                    successMessage: successMsg,
                    access: req.session.user,
                    owner: req.session.admin,
                    cart: cart,
                    cartDetail: cartDetail
                });
            }
        });
    });
});


//GET delete item from shopping cart
router.get('/remove-from-cart/:itemid', function(req,res, next) {

    var itemid = req.params.itemid;

    console.log(req.params.itemid);

    connect(function(err, connection) {
        if (req.params.itemid) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                console.log("Connected to the DB");

                connection.query('DELETE FROM shopping_cart WHERE id=?',[req.params.itemid], function(err, results, fields) {
                    connection.release();

                    console.log('Item deleted ' + req.params.itemid);

                    res.redirect('/user/shopping-cart');
                });
            }
        }
    });
});


//POST update item from shopping cart
router.post('/update-cart', function(req,res, next) {

    var itemId = req.body.refreshUpdate;
    var quantity = req.body.quantityUpdate;

    console.log('itemId ' + itemId);
    console.log('quantity ' + quantity);

    connect(function(err, connection) {
        if (itemId) {
            if (err) {
                console.log("Error connecting to the database");
                throw err;
            }
            else {
                console.log("Connected to the DB");

                connection.query('UPDATE shopping_cart SET quantity=? WHERE id=?',[quantity, itemId], function(err, results, fields) {
                    connection.release();

                    res.redirect('/user/shopping-cart');

                });
            }
        }
    });
});


router.get('/checkout', function(req, res, next) {

    var msg = req.session.msg ? req.session.msg : "";
    // var SuccessMsg = req.session.SuccessMsg ? req.session.SuccessMsg : "";
    var email = req.session.user;
    var cart = '';
    var cartDetail = {};

    var address1 = '';
    var address2 = '';
    var city = '';
    var province = '';
    var postalcode = '';
    var country = '';

    req.session.msg = "";

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");

            connection.query('SELECT * FROM users WHERE email=?',[email], function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                  throw err;
                }
                // address found for user
                else if (results.address1 !== '') {
                  console.log("address found for user " + email);

                  address1 = results[0].address1;
                  address2 = results[0].address2;
                  city = results[0].city;
                  province = results[0].province;
                  postalcode = results[0].postalcode;
                  country = results[0].country;

                }
                // address not found for user
                else {
                    console.log("address not found for user " + email);
                }
            });

            connection.query('SELECT s.id, s.email, s.detailId, s.quantity, d.productsId, d.size, d.color, d.price, p.title, p.description, p.image1 FROM shopping_cart s INNER JOIN product_details d ON s.detailId = d.id INNER JOIN products p ON d.productsId = p.id WHERE s.email=?',[email], function(err, results, fields) {
                // console.log('Query returned ' + JSON.stringify(results));

                if(err) {
                  throw err;
                }
                // no items in cart found
                else if (results.length === 0) {
                  console.log("no items in cart");
                }
                // items in cart found
                else {
                    console.log("items in cart found for" + email);

                    var taxrate = 0.135;
                    var shipping = 10;
                    var subtotal = 0;
                    var tax = 0;
                    var total = 0;

                    for (var i=0; i<results.length; i++) {
                        var excerptLength = 75;
                        var description = results[i].description;
                        var excerpt = "";
                        var linetotal = 0;

                        if (description.length > excerptLength) {
                          excerpt = description.substring(0,excerptLength).trim() + '...';
                        }
                        else {
                          excerpt = description;
                        }

                        results[i].excerpt = excerpt;

                        results[i].price = results[i].price.toFixed(2);

                        linetotal = results[i].price * results[i].quantity;

                        results[i].subtotal = linetotal.toFixed(2);

                        subtotal = subtotal + linetotal;
                    }

                    cart = results;
                    console.log('cart ' + JSON.stringify(cart));

                    tax = subtotal * taxrate;
                    total = subtotal + tax + shipping;

                    cartDetail.tax = tax.toFixed(2);
                    cartDetail.shipping = shipping.toFixed(2);
                    cartDetail.subtotal = subtotal.toFixed(2);
                    cartDetail.total = total.toFixed(2);

                    req.session.cart = cart;
                    req.session.cartDetail = cartDetail;

                    console.log('cartDetail ' + JSON.stringify(cartDetail));
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
                res.render('checkout', {
                    errorMessage: msg,
                    // successMessage: successMsg,
                    access: req.session.user,
                    owner: req.session.admin,
                    address1: address1,
                    address2: address2,
                    city: city,
                    province: province,
                    postalcode: postalcode,
                    country: country,
                    email: email,
                    cart: cart,
                    cartDetail: cartDetail
                });
            }
        });
    });
});


router.post('/checkout', function(req, res, next) {

    var userId = req.session.userId;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var city = req.body.city;
    var province = req.body.province;
    var postalcode = req.body.postalcode;
    var country = req.body.country;

    var shipAddress1 = '';
    var shipAddress2 = '';
    var shipCity = '';
    var shipProvince = '';
    var shipPostalcode = '';
    var shipCountry = '';

    var cart = req.session.cart;

    var cartDetail = req.session.cartDetail;
    var tax = cartDetail.tax;
    var shipping = cartDetail.shipping;

    var ccNumber = req.body.creditCard;
    var ccCVV = req.body.cvv;
    var ccFullName = req.body.fullName;
    var ccMonth = req.body.month;
    var ccYear = req.body.year;

    var themeSettings = req.session.themeSettings;

    req.session.order = true;

    if (req.body.shippingDetails){
        shipAddress1 = req.body.address1;
        shipAddress2 = req.body.address2;
        shipCity = req.body.city;
        shipProvince = req.body.province;
        shipPostalcode = req.body.postalcode;
        shipCountry = req.body.country;
    }
    else {
        shipAddress1 = req.body.shipaddress1;
        shipAddress2 = req.body.shipaddress2;
        shipCity = req.body.shipcity;
        shipProvince = req.body.shipprovince;
        shipPostalcode = req.body.shippostalcode;
        shipCountry = req.body.shipcountry;
    }

    connect(function(err, connection) {
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

                    // insert into order_details
                    connection.query('INSERT INTO order_details (userId, tax, shipping, shipAddress1, shipAddress2, shipCity, shipProvince, shipPostalcode, shipCountry, ccNumber, ccCVV, ccFullName, ccMonth, ccYear) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[userId, tax, shipping, shipAddress1, shipAddress2, shipCity, shipProvince, shipPostalcode, shipCountry, ccNumber, ccCVV, ccFullName, ccMonth, ccYear], function(err, results, fields) {

                        if (err) {
                            console.log("Error connecting to the database - insert");
                            throw err;
                        }
                        else {
                            console.log("Order_details insert successful.");
                            // req.session.user = email;

                            connection.query('SELECT * FROM order_details WHERE userId=? ORDER BY id DESC',[userId], function(err, results, fields) {
                                // console.log('Query returned1 ' + JSON.stringify(results));

                                if (err) {
                                    console.log("Error connecting to the database - select");
                                    throw err;
                                }
                                else {
                                    console.log("Item inserted in Orders successful.");

                                    var orderId = req.session.orderId = results[0].id;

                                    for (var i=0; i<cart.length; i++) {

                                        connection.query('INSERT INTO orders (orderId, productId, price, quantity) VALUES (?,?,?,?)',[orderId, cart[i].detailId, cart[i].price, cart[i].quantity], function(err, results, fields) {
                                            if (err) {
                                                console.log("Error connecting to the database - insert");
                                                throw err;
                                            }
                                        });
                                    }

                                    connection.query('SELECT * FROM order_details WHERE userId=? ORDER BY id DESC',[userId], function(err, results, fields) {
                                        // console.log('Query returned1 ' + JSON.stringify(results));

                                        if (err) {
                                            console.log("Error connecting to the database - select");
                                            throw err;
                                        }
                                        else {
                                            var orderId = req.session.orderId = results[0].id;

                                            connection.query('DELETE FROM shopping_cart WHERE email=?',[req.session.user], function(err, results, fields) {
                                                if (err) {
                                                    console.log("Error connecting to the database - insert");
                                                    throw err;
                                                }
                                                else {
                                                    console.log("shopping cart emptied for " + req.session.user);

                                                    connection.release();
                                                    console.log("Order items deleted successful.");
                                                    // req.session.user = email;
                                                    res.redirect('/user/confirmation');
                                                }
                                            });
                                        }
                                    });


                                    // create reusable transporter object using the default SMTP transport
                                    let transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: process.env.APPSETTING_GMAIL_EMAIL,
                                            pass: process.env.APPSETTING_GMAIL_PASSWORD
                                        }
                                    });

                                    // setup email data with unicode symbols
                                    let mailOptions = {
                                        from: '"' + themeSettings.companyName + '" <' + themeSettings.contactEmail + '>', // sender address
                                        to: email, // list of receivers
                                        subject: 'Your ' + themeSettings.companyName + 'order was successful.', // Subject line
                                        text: 'Your ' + themeSettings.companyName + ' order was successful.', // plain text body
                                        html: '<p>Your '+ themeSettings.companyName + ' order was successful.</p>' // html body
                                    };

                                    // send mail with defined transport object
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message %s sent: %s', info.messageId, info.response);
                                    });

                                }
                            });
                        }
                    });
                }
            });
        }
    });
});


router.get('/confirmation', function(req, res, next) {

    var order = req.session.order ? req.session.order : "";

    req.session.order = "";

    if (order) {

        res.render('confirmation', {
            orderId: req.session.orderId
        });

    } else {

        res.redirect('error');

    }

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

    var userId = req.session.userId;
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
            console.log("Error connecting to the database");
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
                    res.redirect('/user/dashboard/profile');
                }
                // error - email already registered
                else if ((results.length !== 0) && (email !== req.session.user)) {
                    console.log("Email already registered");
                    req.session.msg = "Unable to update. Email address already registered.";
                    res.redirect('/user/dashboard/profile');
                }
                // error - firstname not entered
                else if (firstName.trim().length === 0) {
                    console.log("firstName field empty.");
                    req.session.msg = "Please enter Firstname.";
                    req.session.user = email;
                    res.redirect('/user/dashboard/profile');
                }
                // error - lastname not entered
                else if (lastName.trim().length === 0) {
                    console.log("lastname field empty.");
                    req.session.msg = "Please enter Lastname.";
                    req.session.user = email;
                    res.redirect('/user/dashboard/profile');
                }
                // error - current password empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    console.log("current password field empty.");
                    req.session.msg = "Current password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    res.redirect('/user/dashboard/profile');
                }
                // error - new password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("new password field empty.");
                    req.session.msg = "New password missing. Please re-enter all password fields.";
                    req.session.user = email;
                    res.redirect('/user/dashboard/profile');
                }
                // error - confirm password empty
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("new re-enter password field empty.");
                    req.session.msg = "Re-enter password missing. Please re-enter all password fields.";
                    res.redirect('/user/dashboard/profile');
                }
                // error - new and confirm empty
                else if ((password1.trim().length !== 0) && (password2.trim().length === 0) && (password3.trim().length === 0)) {
                    console.log("only current password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
                    res.redirect('/user/dashboard/profile');
                }
                // error - current and confirm empty
                else if ((password1.trim().length === 0) && (password2.trim().length !== 0) && (password3.trim().length === 0)) {
                    console.log("only new password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    res.redirect('/user/dashboard/profile');
                }
                // error - current and new empty
                else if ((password1.trim().length === 0) && (password2.trim().length === 0) && (password3.trim().length !== 0)) {
                    console.log("only re-enter password entered.");
                    req.session.msg = "Enter all password fields to change password.";
                    req.session.user = email;
                    res.redirect('/user/dashboard/profile');
                }
                // okay - all password filds entered
                else if ((password1.trim().length !== 0) && (password2.trim().length !== 0) && (password3.trim().length !== 0)) {
                    // error - current does not match
                    if (password1.trim() !== results[0].password) {
                        console.log("current password does not match table.");
                        req.session.msg = "Current password is incorrect.  Please re-enter all password fields.";
                        req.session.user = email;
                        res.redirect('/user/dashboard/profile');
                    }
                    // error - current and new do not match
                    else if (password2.trim() !== password3.trim()) {
                        console.log("new and confirm passwords does not match.");
                        req.session.msg = "New and confrim passwords do not match.  Please re-enter all password fields.";
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

                                avatar = results[0].avatar;

                                if(req.file) {
                                    avatar = req.file.filename;
                                }

                                // update replaces password
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

                            avatar = results[0].avatar;

                            if(req.file) {
                                avatar = req.file.filename;
                            }

                            // update does not replace password
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


router.get('/dashboard/orders', function(req, res, next) {

    var orderDetails = [];

    connect(function(err, connection) {
        if (err) {
            console.log("Error connecting to the database");
            throw err;
        }
        else {
            console.log("Connected to the DB");
            console.log('req.session.id: ' + req.session.userId);

            connection.query('SELECT d.id, d.date, d.userId, o.orderId, SUM(o.price * o.quantity) AS SubTotal, d.tax, d.shipping FROM orders o INNER JOIN order_details d ON o.orderId = d.id WHERE d.userId=? GROUP BY o.orderId',[req.session.userId],function(err, results, fields) {

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

            connection.query('SELECT d.id, d.date, d.userId, o.orderId, SUM(o.price * o.quantity) AS SubTotal, d.tax, d.shipping FROM orders o INNER JOIN order_details d ON o.orderId = d.id WHERE o.orderId=? GROUP BY o.orderId',[req.params.id],function(err, results, fields) {
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

                        console.log(orderDetail);
                        orderDetails.push(orderDetail);
                    }
                }
            });

            connection.query('SELECT o.id, o.orderId, o.price, o.quantity, p.title, p.description, p.image1 FROM orders o INNER JOIN product_details d ON o.productId = d.id INNER JOIN products p ON d.productsId = p.id  WHERE o.orderId=? GROUP BY o.id',[req.params.id],function(err, results, fields) {
                // console.log('Query returned4 ' + JSON.stringify(results));

                if(err) {
                    throw err;
                }
                // no user found
                else if (results.length === 0) {
                    console.log("No product details found for order");
                }
                // user found
                else {
                    console.log("Product details found for order");

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
                    orders: true,
                    orderDetails: orderDetails,
                    productDetails: productDetails
                });
            }
        });
    });
});


module.exports = router;
