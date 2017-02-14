var express = require('express');
var app = express();

app.get('/index', function(req, res){
    console.log(req);
    res.send('Hello World!');
})

app.listen(3000, function(){
    console.log("Example app listen on port 3000!");
})
