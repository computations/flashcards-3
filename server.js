var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var bodyparser = require('body-parser');

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

app.use(express.static('public'));
app.use('/static',express.static('static'));
app.get('/', routes.index);
app.get('/card/:id', routes.get_cards);
app.post('/card', jsonparser, routes.create_card);
app.get('/cards/', routes.get_all_cards);
app.post('/upload', upload.single('file'), routes.upload_file);

app.listen(3000, function(){
    console.log("Flashcards app listen on port 3000!");
})
