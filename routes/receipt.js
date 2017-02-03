var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next){
    res.sendFile(path.resolve("client/confirmation.html"));
});

router.get('/confirmation', function(req, res, next){
    function gen() {
        return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
    }
});

module.exports =  router;