var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var app = express();
global._ROOT = __dirname + '/';
var handlebarFactory = require('./app/handlebar.factory.js');
var path = require('path');
var http = require('http');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
var hbs = handlebarFactory.init();
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || '5000');
app.set('trust proxy', 'loopback');

//routes
var writeEmail = require('./routes/write.email.js');
var sendEmail =  require('./routes/send.email.js');
var googleOauthResponse = require('./routes/google.oauth.response.js');
var emailData = require('./routes/email.data.js');

app.use(session({
    secret: 'asdfsa',
    resave: false,
    saveUninitialized: true,
    proxy : true,
    unset : 'destroy'
}));

app.get("/", writeEmail.show);
app.post('/send-email', sendEmail.send);
app.post('/saveEmailData', emailData.save);
app.get('/googleOuathResponse', googleOauthResponse.handle);

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
var server = http.createServer(app);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});