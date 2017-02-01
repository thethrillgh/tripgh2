var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://issifu.suhununu:openme12@ds141128.mlab.com:41128/heroku_sm98ptzk', ['cities', 'users']);
const uuid = require('uuid/v1');
var stripe = require("stripe")(
  "sk_test_xWYoUSXSZLlNHK0k4r0ekWxA"
);
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var path = require('path');
var bcrypt = require('bcrypt-nodejs');

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
               res.redirect("/receipt")
           }
        });
});

//deserialize and serielize user for pesistent login session
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    db.users.findById(id, function(err, user) {
        done(err, user);
    });
});

function generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function validPassword(password){
    return bcrypt.compareSync(password, this.local.password);   
}


////////////////
//local login///
///////////////
router.get('/login', function(req, res, next){
    res.sendFile(path.resolve("client/confirmation.html"));
});

router.post('/login', 
  passport.authenticate('local-login', { failureRedirect: '/login' }),
  function(req, res) {
    res.send('logged in '+req)
//  res.redirect('/receipt');
});

//local login
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
},
function(req, email, password, done) {
    if (email)
        email = email.toLowerCase();

    // asynchronous
    process.nextTick(function() {
        db.users.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, { message: 'Incorrect username.' });

            if (!user.validPassword(password))
                return done(null, false);
            
            hash ( password, user.salt, function (err, hash) {
                if (err) { return done(err); }
                if (hash == user.hash) return done(null, user);
                done(null, false, { message: 'Incorrect password.' });
            });
        });
    });

}));
// process the signup form
    router.post('/signup/:username/:password', passport.authenticate('local-signup'), function(req, res) {
    res.send('logged in '+req);
//  res.redirect('/receipt');
    });

////////////////
//local Sign Up///
///////////////
passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
        email = req.params.username;
        password = req.params.password;
        
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.users.findOne({ 'local.email' :  email }, function(err, user) {
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
                var localemail    = email;
                var localpassword = newUser.generateHash(password);
                var newUser = {
                    'local.email': email,
                    'local.password': localpassword
                }

                // save the user
                db.cities.save(newUser, function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));


module.exports =  router;