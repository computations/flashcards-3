var Schema = require('mongoose').Schema

var history_schema = Schema({
    card: {type:Schema.ObjectId,required:true},
    correct_date: {type:Date, default: Date.now}
});

var user_schema = Schema({
    user_id: {type:String, required: true, unique:true},
    card_history: [history_schema]
});

var user = db.model('users',user_schema);


module.exports = user

module.exports.upsert_user = (oauth_id, cb) => {
    var query = {'user_id' : oauth_id};
    user.findOneAndUpdate(query, query, {upsert: true}, (err, doc) => {
        console.log("user_id:"+ query.oauth_id);
        if(err){console.log(err);}
        cb(err, query.oauth_id);
    });
};
