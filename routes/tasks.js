//Backend API for CRUD actions on database
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://issifu.suhununu:openme12@ds141128.mlab.com:41128/heroku_sm98ptzk', ['cities']);
const uuid = require('uuid/v1');
var stripe = require("stripe")(
  "pk_test_bVSt9LZIbqjtzWjXyDXerEUW"
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
//    var user  = req.body;
//    if (user.tel == '6178348188' && user.pin == '1234'){
//        user.code = uuid();
//        res.send(user);
//    }
      res.send(JSON.stringify(req))
});

router.get('/test/:fname/:lname', function(req, res, next){ 
    res.json({
        'body': req.body,
        'params': req.params.lname
    })
});


// Get Single Task
router.get('/task/:id', function(req, res, next){
    db.tasks.findOne({_id: mongojs.ObjectId(req.params.id)}, function(error, task){
        if(error){
            res.send(error);
        }
        res.json(task);
    });
});

//Save Task
router.post('/task', function(req, res, next){
    var task =  req.body;
    if(!task.title || !(task.isDone+'')){
        res.status(400);
        res.json({
            "error": "Bad data"
        });
    } else {
        db.tasks.save(task, function(error, task){
            if(error){
                res.send(error);
            }
            res.json(task);
        });
    }
});

// Delete Task
router.delete('/task/:id', function(req, res, next){
    db.tasks.remove({_id: mongojs.ObjectId(req.params.id)}, function(error, task){
        if(error){
            res.send(error);
        }
        res.json(task);
    });
});

// Update task
router.put('/task/:id', function(req, res, next){
    var task = req.body;
    var updTask = {};
    if(task.isDone){
        updTask.isDone = task.isDone;
    }
    if(task.title){
        updTask.title = task.title;
    }
    if(!updTask){
        res.status(400);
        res.json({
            "error": "Bad data"
        })
    } else {
            db.tasks.update({_id: mongojs.ObjectId(req.params.id)}, updTask, {},  function(error, task){
            if(error){
                res.send(error);
            }
            res.json(task);
            });
        }
});

module.exports =  router;