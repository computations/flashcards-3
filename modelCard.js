var Schema = require('mongoose').Schema
var media_schema = require('./modelMedia').schema
var deck_schema = require('./modelDeck').schema

var card_schema = Schema({
    id: Schema.ObjectId,
    media:[media_schema],
    decks:[deck_schema]
});

module.exports = db.model('flashcards', card_schema);
