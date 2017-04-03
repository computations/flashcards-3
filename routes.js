var model = require('./modelCard');

exports.get_all_cards = function(req, res, next){
    model.find(function(err, docs){
        if(err) return next(err);
        res.send(docs);
    });
    next();
}

exports.index = function(req, res){
    console.log("connection from " + req.ip);
    res.sendFile('public/html/index.html', {"root":__dirname})
};

var CARD_KEYS = ['media']

exports.get_cards = function(req, res){
    console.log("connection from " + req.ip);
    model.find({_id: req.params.id}, function(err, cards){
        if(err) return console.err(err);
        res.send(cards);
    });
};

exports.upload_image = function(req, res, next){
    console.log(req.file)
}
