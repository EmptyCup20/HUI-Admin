var express = require('express');
var app = express();
var path = require('path');

app.set('view engine', 'html');

app.set('views', path.join(__dirname));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function (req, res, next) {
    var cookie = req.headers.cookie;
    if (req.url === "/favicon.ico") {
        next();
    } else if (cookie.indexOf("accessToken") !== -1) {
        if (req.url !== "/login") {
            res.sendFile(path.join(__dirname, 'index.html'));
        } else {
            res.redirect("/");
        }
    } else {
        if (req.url !== "/login") {
            res.redirect("/login");
        } else {
            res.sendFile(path.join(__dirname, 'login.html'));
        }
    }
});

var server = app.listen(8080, function () {
    console.log('server is started at:127.0.0.1:7001');
});