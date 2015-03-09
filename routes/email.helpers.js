var emailFunctions = require('../js/functions/email.functions');
var emailPersonalisation = require('../app/email.personalisation');

module.exports = {
    getEmailArray: function (hostname, formParams) {
        var options = {includeSignature: formParams['include-signature']};
        var text = formParams['email-content'];
        var subject = formParams['subject'];

        var personalisationData = [];
        var recipientEmails = formParams['email'];
        var singleRecipient = typeof(recipientEmails) === "string";
        var recipients = singleRecipient ? [recipientEmails] : recipientEmails;
        var attributeArray = emailFunctions.getAttributes(text, subject);
        recipients.forEach(function (recipient, index) {
            var emailData = {'email': recipient};
            attributeArray.forEach(function (attribute) {
                var attributeValueArray = formParams[attribute];
                var attributeValue = singleRecipient ? attributeValueArray : attributeValueArray[index];
                emailData[attribute] = attributeValue;
            });
            personalisationData.push(emailData);
        });
        return emailPersonalisation.getEmails(hostname, options, subject, text, personalisationData);
    }
};