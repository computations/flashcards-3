var express = require('express');
var mongoose = require('mongoose');

var uri  = 'mongodb://localhost/flashcards';
global.db = mongoose.createConnection(uri);

var app = express();
var routes = require('./routes');

app.use(express.static('public'));
app.get('/', routes.index);
app.get('/card/:id', routes.get_cards);
app.get('/cards/', routes.get_all_cards);

app.listen(3000, function(){
    console.log("Flashcards app listen on port 3000!");
})
