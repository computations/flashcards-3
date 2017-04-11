var Schema = require('mongoose').Schema

var media_schema = Schema({
    type: {
        type:String,
        required : [true, 'A media must have a type']
    },
    url: String,
    text: String
});

module.exports.schema = media_schema;
module.exports = db.model('media', media_schema);
