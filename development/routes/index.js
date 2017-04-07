var express = require('express');
var router = express.Router();
var connect = require('../database/connect');

router.get('/', function(req, res, net) {
    res.render('index');
});

router.get('/about', function(req, res, net) {
    res.render('about');
});

router.get('/products', function(req, res, net) {
    res.render('products');
});

router.get('/contact', function(req, res, net) {
    res.render('contact');
});

router.get('/sign-in', function(req, res, net) {
    res.render('access');
});

module.exports = router;