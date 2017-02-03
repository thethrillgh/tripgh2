var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://issifu.suhununu:openme12@ds161028.mlab.com:61028/heroku_xswvm03v', ['cities', 'users']);
const uuid = require('uuid/v1');
var stripe = require("stripe")(
  "sk_test_xWYoUSXSZLlNHK0k4r0ekWxA"
);
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

function gen() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
}

//deserialize and serielize user for pesistent login session
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    db.users.find({'_id': id}, function(err, user) {
        done(err, user);
    });
});

function generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(hash, password){
//    return bcrypt.compareSync(password, this.local.password);   
    return bcrypt.compareSync(hash, password);   
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/login')
}

passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function(){
    db.users.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if(user){
          var verified= validPassword(password, user.password);
      }
      if (!verified) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
    });
  }
));

//router for login form
router.post('/login',
  passport.authenticate('local-login', { successRedirect: '/api/success',
                                   failureRedirect: '/api/login',
                                   failureFlash: false })
);

passport.use('local-signup', new LocalStrategy(
    function( username, password, done) {
        // asynchronous
        process.nextTick(function(){
        // checking to see if the user trying to login already exists
        db.users.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, {'signupMessage': 'That email is already taken.'});
            } else {

                // if there is no user with that email
                // create the user
                // set the user's local credentials
                var newUser = {
                    'username': username,
                    'password': generateHash(password)
                }
                // save the user
                db.users.save(newUser, function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }   
        });
        });

    }));

//router for login form
router.post('/signup',
  passport.authenticate('local-signup', { successRedirect: '/api/success',
                                   failureRedirect: '/api/login',
                                   failureFlash: false })
);

//route for login fail
router.get('/login', function(req, res, next){
    res.send('fail')
});
//route for check
router.get('/check', function(req, res, next){
    if(req.user){
        console.log('user is '+req.session.passport.user)
        res.send('you are logged in ')
    }
    else{
        res.send('not logged in')
    }
});
//route for check
router.get('/logout', function(req, res, next){
    if(req.user){
        req.logout();
        res.send('you have been logged out ')
    }
    else{
        res.send('not logged in')
    }
});

//route for login success
router.get('/success', ensureAuthenticated, function(req, res, next){
//    res.redirect('/login')
    console.log('user is '+req.session.passport.user)
    res.send(true)
});


//route for login success
router.get('/cookie', function(req, res, next){
//    res.send(JSON.stringify(req.session.item))
    res.send(req.session.item)
});

//Get all users
router.get('/myusers', function(req, res, next){
    db.users.find(
        {}, 
    
    function(error, tasks){
        if(error){
            res.send(error);
        }
        res.json(tasks);
    });
});
//Get all tickets
router.get('/tickets', function(req, res, next){
    db.cities.find(
        {}, 
        {"_id": 0, "destination": 1, "origin": 1, "days": 1, "fare": 1, 'dep_time': 1},
    
    function(error, tasks){
        if(error){
            res.send(error);
        }
        res.json(tasks);
    });
});

//Get specific ticket
router.get('/tickets/:origin/:destination/:day', function(req, res, next){
    db.cities.find(
        { 'origin':req.params.origin, 'destination': req.params.destination, 'days': req.params.day},
    
    function(error, ticket){
        if(error){
            res.send(error);
        }
        res.json(ticket);
    });
});

//get payment, confirm and send ticket details
router.post('/tickets', function(req, res, next){
        var stripeToken = req.body.stripeToken;
        var charge = {
            amount: req.body.fare*100,
            currency: 'usd',
            card: stripeToken,
            metadata: {'email': req.body.emailadd}
        };
        stripe.charges.create(charge, function(err, charge){
           if(err){
               res.send(JSON.stringify(err));
           }  else {
               var item = {
                   id: stripeToken,
                   code: gen(),
                   name: req.body.name,
                   origin: req.body.origin,
                   destination: req.body.destination,
                   time: req.body.time,
                   fare: req.body.fare,
                   day: req.body.day,
               }
               db.users.save(item, function(err) {
                    if (err)
                        throw err;
                });
               req.session.item=JSON.stringify(item);
               res.redirect("/receipt")
           }
        });
});

module.exports =  router;