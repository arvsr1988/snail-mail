var request = require('request');
var emailHelpers = require('./email.helpers');
var emailer = require('./emailer');
var transportHelper = require(_ROOT + 'app/transport.helper.js');
var requestHelpers = require(_ROOT + 'app/request.helpers.js');

module.exports = {
handle: function (req, res) {
    var hostname =  requestHelpers.getHostName(req);
    var form = {
        code: req.body.googleOauthCode,
        client_id: '421703536444-megt0e62oo4kjamdavcq451f61snfi70.apps.googleusercontent.com',
        client_secret: 'lSkDHrnRyTYIjxNqAU_s7UD9',
        redirect_uri: hostname + '/googleOauthResponse',
        grant_type: 'authorization_code'
    };
    var accessToken = '';
    request.post({
        url: 'https://accounts.google.com/o/oauth2/token',
        form: form,
        json: true
    }, function (err, response, body) {
        accessToken = body.access_token;
        var headers = {
            'Authorization': 'Bearer ' + accessToken
        };
        if(!body.access_token){
            console.log("ERROR - Unable to retrieve access token");
            console.log(body);
            res.json({successful : false, message : "Oops, something went wrong. Please try again"});
            return;
        }
        request.get({
            url: 'https://www.googleapis.com/plus/v1/people/me',
            headers: headers,
            json : true
        }, function (err, response, body) {
            var emailFormParams = req.body;
            const {attachmentName, attachmentData} = req.body;
            if(!emailFormParams){
                res.send(200);
                return;
            }
            var fromEmail = body.emails[0].value;
            var emailContent = emailHelpers.getEmailArray(hostname, emailFormParams);
            emailFormParams['email-account'] = fromEmail;
            emailFormParams['accessToken'] = accessToken;
            emailFormParams.attachment = {name : attachmentName, data: attachmentData}
            var serviceName = 'Gmail';
            var transportObject = transportHelper.getServiceTransport(serviceName, emailFormParams);
            emailer.sendEmails(emailContent, emailFormParams, transportObject, serviceName, function(response){
                res.json(response);
            });
        });
    });
}
};