var express = require('express');
var router = express.Router();
var connect = require('../database/connect');


router.get('/dashboard/profile', function(req, res, next) {

    res.render('dashboard/profile', {
        access: req.session.user,
        owner: req.session.admin,
        profile: true
    });
});

router.get('/dashboard/orders', function(req, res, next) {

    res.render('dashboard/orders', {
        access: req.session.user,
        owner: req.session.admin,
        orders: true
    });
});

router.get('/dashboard/products', function(req, res, next) {

    res.render('dashboard/products', {
        access: req.session.user,
        owner: req.session.admin,
        products: true
    });
});

router.get('/dashboard/users', function(req, res, next) {

    res.render('dashboard/users', {
        access: req.session.user,
        owner: req.session.admin,
        users: true
    });
});


module.exports = router;
