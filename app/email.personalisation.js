var emailFunctions = require('../js/functions/email.functions.js');
var string = require('./string.js');

var getHTMLFromText = function(text){
  return string.replaceAll(text, '\n', '<br />');
};

var getEmails = function(hostname, options, subject, text, personalisationData){
    if(options.includeSignature){
        text = text + '<br /><br /> This email was personalised using <a href="' + hostname + '"> Snail Mail</a>';
    }
    var emailAttrs = emailFunctions.getAttributes(text, subject);
    var emailArray = [];
    personalisationData.forEach(function(emailData){
        var email = {to : emailData['email']};
        email.text = getHTMLFromText(text.substring(0));
        email.subject = subject;
        emailAttrs.forEach(function(attr){
            var attributeValue = emailData[attr];
            email.text = string.replaceAll(email.text, '${' + attr + '}', attributeValue);
            email.subject = string.replaceAll(email.subject, '${' + attr + '}', attributeValue);
        });
        emailArray.push(email);
    });
    return emailArray;
};

exports.getEmails = getEmails;
exports.getHTMLFromText = getHTMLFromText;
