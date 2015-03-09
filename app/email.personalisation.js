var emailFunctions = require('../js/functions/email.functions.js');

var getEmails = function(hostname, options, subject, text, personalisationData){
    if(options.includeSignature){
        text = text + '<br /><br /> This email was personalised using <a href="' + hostname + '"> Snail Mail</a>';
    }
    var emailAttrs = emailFunctions.getAttributes(text, subject);
    var emailArray = [];
    personalisationData.forEach(function(emailData){
        var email = {to : emailData['email']};
        email.text = text.substring(0);
        emailAttrs.forEach(function(attr){
            var attributeValue = emailData[attr];
            email.text = email.text.replace('${' + attr + '}', attributeValue);
            email.subject = subject.replace('${' + attr + '}', attributeValue);
        });
        emailArray.push(email);
    });
    return emailArray;
};

exports.getEmails = getEmails;