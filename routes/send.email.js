var emailFunctions = require('../js/functions/email.functions');
var emailer = require('./emailer');
exports.send = function(req,res) {
    console.log(req.body);

    var getEmails = function(){
        var emailContent = req.param('email-content');
        var emailAttrs = emailFunctions.getAttributes(emailContent);
        var recipients = req.param('recipients').split(',');
        var emailArray = [];
        recipients.forEach(function(recipient, index){
            var email = {to : recipient};
            email.text = emailContent.substring(0);
            emailAttrs.forEach(function(attr){
                var attributeValueArray = req.param(attr);
                email.text = email.text.replace('${' + attr + '}', attributeValueArray[index]);
            });
            emailArray.push(email);
        });
        return emailArray;
    };

    var emailArray = getEmails();
    emailer.sendEmails(emailArray, req.body, function(emailResponses){
       console.log(emailResponses);
        res.send(200);
    });
};