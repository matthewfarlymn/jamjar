var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("req.session.testMessage: " + req.session.testMessage);
  // As a test I am going to save something on the users session. The users session
  // gets added to the request object for easy access.

  if (!req.session.hasOwnProperty('testMessage')) {
    // ok I have a session but it doesn't have the property 'testMessage' because
    // it is a new session
    console.log("Session is new");
    req.session.testMessage = "If you see this then you have a working session object";
  } else {

    req.session.testMessage = "This is an old session";
  }
  

  res.render('index', { title: 'Session Test' });
});

router.get('/sessionTest', function(req, res, next) {
  // Lets get the testMessage that we stored on the users session
  // and pass it to the testSession jade page
  res.render('testSession',{msg: req.session.testMessage});
});

module.exports = router;
