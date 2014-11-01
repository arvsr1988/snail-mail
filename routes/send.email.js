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
                var attributeValue = typeof(attributeValueArray) === 'string' ? attributeValueArray : attributeValueArray[index];
                email.text = email.text.replace('${' + attr + '}', attributeValue);
            });
            emailArray.push(email);
        });
        return emailArray;
    };

    var emailArray = getEmails();
    emailer.sendEmails(emailArray, req.body, function(emailResponses){
       console.log(emailResponses);
        var successful = true;
        var emailStatusArray = [];
        emailResponses.forEach(function(emailResponse, index){
            successful = successful && emailResponse.successful;
            emailStatusArray[index] = {};
            emailStatusArray[index].successful = emailResponse.successful;
            emailStatusArray[index].error = '';
            if(!emailResponse.successful){
                emailStatusArray[index].error = emailResponse.error.response;
            }
            emailStatusArray[index].to = emailResponse.email.to;
        });
        //TODO : send the trimmed response here
        var response = {successful : successful, emails : emailStatusArray};
        res.json(response);
    });
};