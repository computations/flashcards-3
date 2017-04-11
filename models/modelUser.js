var Schema = require('mongoose').Schema

var history_schema = Schema({
    card: {type:Schema.ObjectId,required:true},
    correct_date: {type:Date, default: Date.now}
});

var user_schema = Schema({
    username: {type:String, required: true, unique:true},
    pw_hash: {type: String, required: true},
    card_history: [history_schema]
});

module.exports = db.model('users', user_schema);
