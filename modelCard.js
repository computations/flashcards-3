var Schema = require('mongoose').Schema
var media_schema = require('./modelMedia').schema

var card_schema = Schema({
    media:[media_schema]
});

module.exports = db.model('flashcards', card_schema);
