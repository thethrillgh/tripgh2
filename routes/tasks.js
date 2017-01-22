var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://issifu.suhununu:openme12@ds141128.mlab.com:41128/heroku_sm98ptzk', ['cities']);
const uuid = require('uuid/v1');
var stripe = require("stripe")(
  "sk_test_xWYoUSXSZLlNHK0k4r0ekWxA"
);

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


module.exports =  router;