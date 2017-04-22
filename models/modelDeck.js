var Schema = require('mongoose').Schema

var deck_schema = Schema({
        title: String,
        imgUrl: String,
        desc: String
});

module.exports.schema = deck_schema;
module.exports = db.model('deck', deck_schema);
