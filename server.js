var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var crypto = require('crypto');
var fs = require('fs');
var hash = crypto.createHash('sha256')


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
app.use('/static',express.static('static'));
app.get('/', routes.index);
app.get('/card/:id', routes.get_cards);
app.get('/cards/', routes.get_all_cards);

var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads')

	},
	filename: function(req, file, cb){
		cb(null, file.originalname);
	}
});

/*
var upload = multer({
	storage: storage
}).single('file'); 
*/

var upload = multer({storage: storage});

app.post('/upload', upload.single('file'), function(req, res){
    console.log(req.file);
    var file_type = req.file.mimetype.split('/')[0]
    var new_dir = 'static/'+file_type+'/';
    if(!fs.existsSync(new_dir)){
        fs.mkdirSync(new_dir);
    }
    var hashed_file = hash.update(fs.readFileSync(req.file.path)).digest('hex');
    var filename=new_dir + hashed_file;
    fs.renameSync(req.file.path, filename);
    console.log(filename);
    res.send(filename);
}); 

app.listen(3000, function(){
    console.log("Flashcards app listen on port 3000!");
})
