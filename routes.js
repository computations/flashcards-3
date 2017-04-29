var card_model = require('./models/modelCard');
var media_model = require('./models/modelMedia');
var deck_model = require('./models/modelDeck');
var user_model = require('./models/modelUser');
var crypto = require('crypto');
var fs = require('fs');
var mongoose = require('mongoose');

exports.get_all_cards = function(req, res, next){
    console.log("getting all cards");
    card_model.find(function(err, docs){
        if(err) return next(err);
        return res.send(docs);
    });
    //next(); //Creates error 
}

exports.index = function(req, res){
    console.log("connection from " + req.ip);
    res.sendFile('public/html/index.html', {"root":__dirname})
};

var CARD_KEYS = ['media']

exports.get_cards = function(req, res){
    console.log("connection from " + req.ip);
    card_model.findOne({_id: req.params.id}, function(err, cards){
        if(err) return console.log(err);
        res.send(cards);
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
    if(!fs.existsSync(filename)){
        fs.rename(req.file.path, filename, function(){
            res.send({'url': filename, 'media_type': file_type});
        });
    }
    else{
        fs.unlink(req.file.path, () => {
            res.send({'url': filename, 'media_type': file_type});
        });
    }
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
exports.create_card = function(req, res, next){
    var media_list =[];
    console.log(req.body)
    for(var m of req.body.media){
        media_list.push( new media_model(m));
    }
    new_title = req.body.title;
    new_desc = req.body.description;
    console.log("requested media list");
    console.log(media_list)
    var new_card = new card_model({media:media_list, title:new_title, 
        description:new_desc});
    new_card.save((err) =>{
        if(err){
            console.log(err);
        }
    });
    console.log(new_card._id);
    res.send(new_card._id);
    next();
};

exports.update_card = function(req, res, next){
    var update_card = {}
    if(req.body.media){
        update_card.media = [];
        for(var m of req.body.media){
            update_card.media.push(new media_model(m));
        }
    }
    if(req.body.title){
        update_card.title=req.body.title;
    }
    if(req.body.description){
        update_card.description = req.body.description;
    }
    console.log("updating card: " + req.params.id);
    card_model.update({'_id':req.params.id}, update_card, {}, 
            (err, num) => { console.log( num);
                if(err){console.log(err);} res.send(); });
}

exports.get_decks = function(req, res, next){
    deck_model.find({}, (err, decks) => {
        if(err){
            console.log(err);
        }
        res.send(decks);
    });
}

exports.get_deck = function(req, res){
    deck_id = req.params.deck 
    card_model.find({'decks._id': deck_id}, function(err, deck){
        if(err){
            console.log(err);
        }
        res.send(deck);
    });
}

exports.create_deck = function(req, res){
    var new_deck = new deck_model({title: req.body.title, desc: req.body.desc, 
        imgUrl: req.body.imgUrl});
    new_deck.save(function(error, deck, n){
        card_model.findByIdAndUpdate(
                req.body.cards,
                {$push: {"decks": deck}},
                {safe: true, upsert:true},
                function(err, _){
                    console.log(deck._id);
                    res.send(deck._id);
                }
        );
    });
}

exports.add_cards_to_deck = function(req, res){
    deck_id = req.params.deck;
    console.log("deck id:", deck_id);
    new_cards = req.body.cards;
    deck_model.findOne({'_id' : deck_id}, (err, deck, n) => {
        console.log(deck);
        if(err){
            console.log(err);
        }
        else{
            card_model.update(
                {_id: {$in: new_cards}},
                {$push: {decks: deck}},
                {safe: true, upsert:true},
                (err, num) => {
                    if(err){
                        console.log(err);
                    }
                    res.send();
                }
            );
        }
    });
}
var card_include_check = function (card) {
    var recent_date = card.correct_dates[0]
    var backoff = new Date(recent_date);
    backoff.setDate(newdate.getDate()+2*card.num_correct);
    var now = new Date();
    return backoff < now;
};

exports.get_user = function(req, res){
    res.send(req.user);
}

exports.get_quiz = function(req, res){
    if(!req.user){
        res.send();
    }
    else{
        var deck_id = req.params.deck;
        card_model.find({"decks._id": deck_id}, (err,docs) => {
            card_ids = []
            for(let c of docs){
                card_ids.push(c._id);
            }
            var user_query = { 
                "user_id":req.user.user_id,
                "card_history.card": {$in : card_ids}
            };
            user_model.find(user_query,  (err, cards) =>{
                var quiz_card_ids = card_ids;
                for(let c of cards){
                    if(!card_include_check(c)){
                        console.log("removing card",c );
                        var idx = quiz_card_ids.indexOf(c);
                        quiz_card_ids.splice(idx, 1);
                    }
                }
                console.log(quiz_card_ids);
                var query = {"_id" : {$in : quiz_card_ids}};
                card_model.find(query, (err, quiz_cards) => {
                    res.send(quiz_cards);
                });
            });
        });
    }
};

//need to insure assumptions
// - dates are sorted, descending
// - num_correct is correct
exports.update_quiz = function(req, res){
    var user_id = req.user.id;
    var update_card = req.body.card_id;
    var query = {
        "user_id": user_id,
    };

    user_model.findOneAndUpdate(query, null, {upsert:true}, (err, user)=>{
        if(err) console.log(err);
        else{
            var idx = 0;
            for(var i = 0; i < user.card_history.length; ++i){
                if(user.card_history[i].card == update_card){
                    idx = i;
                    break;
                }
            }
            if(req.body.correct){
                user.card_history[idx].correct_dates.unshift(new Date());
                user.card_history[idx].num_correct+=1;
            }
            else{
                user.card_history[idx].num_correct=0;
            }
            user.save();
        }
    });
}
