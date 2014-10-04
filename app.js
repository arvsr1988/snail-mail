var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var expressHbs = require('express-handlebars');
var path = require('path');
var http = require('http');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout : 'main.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || '5000');

//routes
var writeEmail = require('./routes/write.email.js');
var sendEmail =  require('./routes/send.email.js');

app.get("/", function(req, res){
    var data = {name : "arvind", layout : false};
    res.render('home', data);
});

app.get('/write-email', writeEmail.show);
app.post('/send-email', sendEmail.send);

module.exports = app;
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});