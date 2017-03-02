var model = require('./modelCard');

exports.get_all_cards = function(req, res, next){
    model.find(function(err, docs){
        if(err) return next(err);
        res.send(docs);
    });
}

exports.index = function(req, res){
    console.log("connection from " + req.ip);
    res.sendFile('public/html/index.html', {"root":__dirname})
};

exports.get_cards = function(req, res){
    console.log("connection from " + req.ip);
    res.send(req.params.id)
};
