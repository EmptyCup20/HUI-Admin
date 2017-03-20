var express = require('express');
var app = express();
var path = require('path');

app.set('view engine','html');

app.set('views',path.join(__dirname));

app.use(express.static(path.join(__dirname,'public')));

app.use('/',function(req,res){
    var indexPath = path.join(__dirname,'index.html');
    res.sendFile(indexPath);
});

var server = app.listen(7001,function(){
    console.log('server is started at:127.0.0.1:7001');
});