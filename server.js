var express = require('express');
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');
var multer = require('multer');
var bodyparser = require('body-parser');
var fs = require('fs');
var passport = require('passport');
var google_strat = require('passport-google-oauth20').Strategy;
var express_session = require('express-session');

var uri  = 'mongodb://localhost/flashcards';
global.db = mongoose.createConnection(uri);

var media_model = require('./models/modelMedia')
var card_model = require('./models/modelCard')
var deck_model = require('./models/modelDeck')
var user_model = require('./models/modelUser')
var app = express();
var routes = require('./routes');
var app_secrets = require('./secrets');

/******************************************************************************
 * Some useful const values. These need to be changed when deployed
 */
const http__url = "http://localhost:3000" 
const https_url = "https://localhost:3443" 

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

    example_deck.save()

    var example_card = new card_model({
        media : [example_media],
        decks : [example_deck]
    });

    example_card.save();
});
deck_model.remove({}, () => {console.log("decks cleared");});

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

/******************************************************************************
 * User auth stuff
 */
passport.use(new google_strat({
        clientID: app_secrets.client_id,
        clientSecret: app_secrets.client_secret,
        callbackURL: https_url+'/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
        user_model.upsert_user(profile.id, (err, user) => {
            if(err){console.log(err);}
            return cb(err, user);
        });
    }
));

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((obj, cb) => {
    cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));
app.get(
    '/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/'}),
    (req, res) => {
        console.log("auth callback");
        res.redirect('/');
    }
);

app.use(require('express-session')({ 
    secret: app_secrets.sessions_secret,
    resave: true, 
    saveUninitialized: true }));

/******************************************************************************
 *Routing
 */
app.use(express.static('public'));
app.use('/static',express.static('static'));
app.get('/', routes.index);

app.get('/card/:id', routes.get_cards);
app.post('/card', jsonparser, routes.create_card);
app.post('/card/:id', jsonparser, routes.update_card);
app.get('/card', routes.get_all_cards);

app.get('/deck', routes.get_decks);
app.get('/deck/:deck', routes.get_deck);
app.post('/deck', jsonparser, routes.create_deck);
app.post('/deck/:deck', jsonparser, routes.add_cards_to_deck);

app.post('/upload', upload.single('file'), routes.upload_file);

var private_key = fs.readFileSync('ssl/server.key', 'utf-8');
var cert = fs.readFileSync('ssl/server.crt', 'utf-8');

var options = {key: private_key, cert: cert}

http.createServer(app).listen(3000);
https.createServer(options, app).listen(3443)
