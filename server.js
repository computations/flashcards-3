var express = require('express');
var app = express();

app.get('/index', function(req, res){
    console.log(req);
    res.send('Hello World!');
})

app.get('/cards/:id?', function(req, res){
    console.log("connection from " + req.ip);
    res.send(req.params.id)
})

app.listen(3000, function(){
    console.log("Flashcards app listen on port 3000!");
})
