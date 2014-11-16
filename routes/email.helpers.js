var emailFunctions = require('../js/functions/email.functions');

module.exports = {

    getEmailArray : function(formParams){
        var emailContent = formParams['email-content'];
        var subject = formParams['subject'];
        var emailAttrs = emailFunctions.getAttributes(emailContent);
        emailAttrs.push(emailFunctions.getAttributes(subject));
        var recipients = formParams['recipients'].split(',');
        var emailArray = [];
        var singleRecipient = recipients.length === 1;
        recipients.forEach(function(recipient, index){
            var email = {to : recipient};
            email.text = emailContent.substring(0);
            emailAttrs.forEach(function(attr){
                var attributeValueArray = formParams[attr];
                var attributeValue = singleRecipient ? attributeValueArray : attributeValueArray[index];
                email.text = email.text.replace('${' + attr + '}', attributeValue);
                email.subject = subject.replace('${' + attr + '}', attributeValue);
            });
            emailArray.push(email);
        });
        return emailArray;
    }
};