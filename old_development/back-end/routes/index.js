// var express = require('express');
// var router = express.Router();
//
// router.get('/', function(req, res, next){
//   var connection = req.app.settings.dbConnection;
//
//   connection.query('SELECT id, color, animal FROM colors', function(err, results) {
//     if (err) throw err;
//
//     for (var i=0; i<results.length; i++) {
//       console.log("Color" + results[i].id + " : " + results[i].color + " " + results[i].animal);
//     }
//
//     res.render('index', { title: 'Colors', colors: results });
//
//   });
//
//
// });
//
// router.post('/addColor', function(req, res, next) {
//   var connection = req.app.settings.dbConnection;
//
//   var enteredColor = req.body.color;
//   var enteredAnimal = req.body.animal;
//
//   console.log(req.body.color);
//   console.log(req.body.animal);
//
//   console.log(enteredColor);
//   console.log(enteredAnimal);
//
//   // var record = { color: enteredColor, animal: enteredAnimal };
//   var record = [enteredColor, enteredAnimal];
//
//   console.log(record);
//
//   connection.query('INSERT INTO colors (color, animal) VALUES(?,?)', record, function(err, result) {
//   // connection.query('INSERT INTO colors VALUES(?,?)', record, function(err, result) {
//     if (err) throw err;
//
//     console.log(result.insertId);
//     res.redirect('/');
//   });
// });
//
//
// router.get('/deleteColor', function(req, res, next) {
//   var connection = req.app.settings.dbConnection;
//
//   var colorID = req.query.id;
//
//   connection.query('delete from colors where id=?', [colorID], function(err, result) {
//     if (err) throw err;
//
//     console.log(result.insertId);
//     res.redirect('/');
//   });
// });
//
// module.exports = router;

var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){
  var connection = req.app.settings.dbConnection;

  connection.query('SELECT customerId, customerFirstName, customerLastName FROMuggi customer', function(err, results) {
    if (err) {
      throw err;
    }

    for (var i=0; i<results.length; i++) {
      console.log("Customer" + results[i].customerId + " : " + results[i].customerFirstName + " " + results[i].customerLastName);
    }

    res.render('index', { title: 'Customers', customer: results });

  });


});

router.get('/addCustomer', function(req, res, next) {
  var connection = req.app.settings.dbConnection;

  var id = -1;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var street1 = req.body.street1;
  var street2 = req.body.street2;
  var city = req.body.city;
  var county = req.body.county;
  var postcode = req.body.postcode;
  var phone = req.body.phone;
  var mobile = req.body.mobile;
  var email = req.body.email;
  var password = req.body.password;
  var confirm = req.body.confrimPassword;
  var avatar = req.body.avatar;
  var active = 1;

  console.log(firstname);
  console.log(lastname);
  console.log(street1);
  console.log(street2);
  console.log(city);
  console.log(county);
  console.log(postcode);
  console.log(phone);
  console.log(mobile);
  console.log(email);
  console.log(password);
  console.log(avatar);
  console.log(active);

  var record = [firstname, lastname, street1, street2, city, county, postcode, phone, mobile, email, password, avatar, active];

  connection.query('INSERT INTO customer (customerFirstName, customerLastName, customerStreet1, customerStreet2, customerCity, customerCounty, customerPostcode, customerPhone, customerMobile, customerEmail, customerPassword, customerAvatar, customerActive) ' +
    'VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)', record, function(err, result) {

  // connection.query('INSERT INTO colors (color, animal) VALUES(?,?)', record, function(err, result) {

    if (err) throw err;

    console.log(result.insertId);
    res.redirect('/');
  });
});


router.get('/deleteColor', function(req, res, next) {
  var connection = req.app.settings.dbConnection;

  var colorID = req.query.id;

  connection.query('delete from colors where id=?', [colorID], function(err, result) {
    if (err) {
      throw err;
    }

    console.log(result.insertId);
    res.redirect('/');
  });
});




/* GET home page. */
// router.get('/login', function(req, res, next) {
//   res.render('login');
// });
//
//
// // POST /login
// router.post('/login', function(req, res, next) {
//   var username = req.body.username;
//
//   username=username.trim();
//
//   if (username.legth == 0) {
//     res.render('/logon');
//   }
//   else {
//     req.session.username = username;
//     res.redirect('/');
//   }
// });



// // POST /customer
// router.post('/customer', function(req, res, next) {
// //     console.log(req.body.fname);
//
//     var fname = req.body.fname;
//     var lname = req.body.lname;
//     var street1 = req.body.street1;
//     var street2 = req.body.street2;
//     var city = req.body.city;
//     var county = req.body.county;
//     var postcode = req.body.postcode;
//     var phone = req.body.phone;
//     var email = req.body.email;
//     var password = req.body.password;
//     var confirm = req.body.confirm;
//
//     res.render('hello', {name: req.body.fname });
// });


module.exports = router;
