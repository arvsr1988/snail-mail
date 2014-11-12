var emailFunctions = require('../js/functions/email.functions');
var emailer = require('./emailer');
var emailHelper = require('./email.helpers');
// @arvind This is dysfunctional at the moment.
exports.send = function(req,res) {
    console.log(req.body);

    var emailArray = emailHelper.getEmailArray(req.body);
    emailer.sendEmails(emailArray, req.body, null, function(emailResponses){
        res.json(emailResponses);
    });
};