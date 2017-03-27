var Schema = require('mongoose').Schema

var media_schema = Schema({
        type: String,
        url: String
});

module.exports.schema = media_schema;
module.exports = db.model('media', media_schema);
