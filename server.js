var express = require('express');
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');
var multer = require('multer');
var bodyparser = require('body-parser');
var fs = require('fs');
var passport = require('passport');
var google_strat = require('passport-google-oauth20').Strategy;

var uri  = 'mongodb://localhost/flashcards';
global.db = mongoose.createConnection(uri);

var media_model = require('./models/modelMedia')
var card_model = require('./models/modelCard')
var deck_model = require('./models/modelDeck')
var user_model = require('./models/modelUser')
var app = express();
var routes = require('./routes');

/*
 * While we are testing, clear the database everytime the app starts
 */
media_model.remove({}, function(err){
    console.log("Media collection cleared");
});

card_model.remove({}, function(err){
    console.log("Card collection cleared");
    var example_media = new media_model({
        type: "image",
        url: "www.newest_example.com"
    });

    var example_deck = new deck_model({
        title: "Test Deck",
        desc: "The example deck"
    });

    var example_card = new card_model({
        media : [example_media],
        decks : [example_deck]
    });

    example_card.save();
});

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')

    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage});

var jsonparser = bodyparser.json();

/*
 * User auth stuff
 */

app.use(express.static('public'));
app.use('/static',express.static('static'));
app.get('/', routes.index);

app.get('/card/:id', routes.get_cards);
app.post('/card', jsonparser, routes.create_card);
app.get('/card', routes.get_all_cards);

app.get('/deck', routes.get_decks);
app.get('/deck/:deck', routes.get_deck);
app.post('/deck', jsonparser, routes.create_deck);

app.post('/upload', upload.single('file'), routes.upload_file);

var private_key = fs.readFileSync('ssl/server.key', 'utf-8');
var cert = fs.readFileSync('ssl/server.crt', 'utf-8');

var options = {key: private_key, cert: cert}

http.createServer(app).listen(3000);
https.createServer(options, app).listen(3443)
