var emailFunctions = require('../js/functions/email.functions');

module.exports = {

    getEmailArray : function(hostname, formParams){
        var emailContent = formParams['email-content'];
        if(formParams['include-signature']){
            emailContent = emailContent + '<br /><br /> This email was personalised using <a href="' + hostname + '"> Snail Mail</a>';
        }
        var subject = formParams['subject'];
        var emailAttrs = emailFunctions.getAttributes(emailContent, subject);
        var recipientEmails = formParams['email'];
        var singleRecipient = typeof(recipientEmails) === "string";
        var recipients = singleRecipient ? [recipientEmails] : recipientEmails;
        var emailArray = [];
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