var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
global._ROOT = __dirname + '/';
var handlebarFactory = require('./app/handlebar.factory.js');
var path = require('path');
var http = require('http');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json({limit : '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
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
var sendGmailEmails = require('./routes/send_via_gmail.js');
var googleOauthResponse = require(_ROOT + './routes/google_oauth_response');

app.get("/", writeEmail.show);
app.post('/send-email', sendEmail.send);
app.post('/send-gmail-emails', sendGmailEmails.handle);
app.get('/googleOauthResponse', googleOauthResponse.handle);

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;

var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster && process.env.NODE_ENV==="production") {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    var server = http.createServer(app);
    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}
