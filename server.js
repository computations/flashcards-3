var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');


var uri  = 'mongodb://localhost/flashcards';
global.db = mongoose.createConnection(uri);

var media_model = require('./modelMedia')
var card_model = require('./modelCard')
var app = express();
var routes = require('./routes');

var example_media = new media_model({
    type: "image",
    url: "www.newest_example.com"
});

var example_card = new card_model({
    media : [example_media]
});

example_card.save();

app.use(express.static('public'));
app.get('/', routes.index);
app.get('/card/:id', routes.get_cards);
app.get('/cards/', routes.get_all_cards);

app.listen(3000, function(){
    console.log("Flashcards app listen on port 3000!");
})
