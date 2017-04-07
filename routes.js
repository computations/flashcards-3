var card_model = require('./modelCard');
var media_model = require('./modelMedia');
var crypto = require('crypto');
var fs = require('fs');

exports.get_all_cards = function(req, res, next){
    card_model.find(function(err, docs){
        if(err) return next(err);
        return res.send(docs);
    });
   // next(); Creates error 
}

exports.index = function(req, res){
    console.log("connection from " + req.ip);
    res.sendFile('public/html/index.html', {"root":__dirname})
};

var CARD_KEYS = ['media']

exports.get_cards = function(req, res){
    console.log("connection from " + req.ip);
    card_model.find({_id: req.params.id}, function(err, cards){
        if(err) return console.err(err);
        if(cards.length!=1){
            res.send([]);
        }
        else{
            res.send(cards[0]);
        }
    });
};

exports.upload_file = function(req,res){
    var file_type = req.file.mimetype.split('/')[0]
    var new_dir = 'static/'+file_type+'/';
    if(!fs.existsSync(new_dir)){
        fs.mkdirSync(new_dir);
    }
    var hash = crypto.createHash('sha256')
    var hashed_file = hash.update(fs.readFileSync(req.file.path)).digest('hex');
    var filename=new_dir + hashed_file;
    fs.rename(req.file.path, filename, function(){
        res.send(filename);
    });
};
 
/*
 * request object:
 * {
 *     media: [
 *        {
 *           type: _____,
 *           url: _____,
 *        }, ... 
 *     ]
 * }
 */
exports.create_card = function(req, res){
    var media_list =[];
    console.log(req.body)
    for(var m of req.body.media){
        media_list.push( new media_model({
            type: m.type,
            url: m.url
        }));
    }
    var new_card = new card_model({media:media_list});
    new_card.save();
    res.send(new_card._id);
};
