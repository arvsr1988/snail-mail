var emailPersonalisation = require('./page-inits/email_personalisation.js');
var emailFunctions = require('./functions/email.functions.js');
var fileUploadHandler = require('./personalisation/file.upload.handler.js');
var flow = require('./page-inits/flow');
var sink = require('./personalisation/sink');
var toggle = require('./toggles');
var tracking = require('./tracking');
var sampleFileDownload = require('./personalisation/sample_file_download.js');

var init = function () {
    //this shouldn't be accepting a callback function! Its a synchronous method! :@
    var csvEmailsValid = function (csvEmailString, callback, context) {
        if (!csvEmailString || csvEmailString.length === 0) {
            return false;
        }
        var individualEmails = csvEmailString.split(",");
        var emailArray = [];
        var emailsValid = individualEmails.every(function (email) {
            var trimmedEmail = email.trim();
            emailArray.push({email: trimmedEmail});
            return emailFunctions.isValidEmail(trimmedEmail);
        });
        if (!emailsValid) {
            return false;
        }
        callback.apply(context, [emailArray]);
        return true;
    };

    var validateEmails = function () {
        var emailsValid = csvEmailsValid($("#csv-recipients").val(), emailPersonalisation.init, emailPersonalisation);
        var fileUploadValid = fileUploadHandler.validateUpload($("#email-attributes-file"), emailPersonalisation.init, emailPersonalisation);
        if (!emailsValid && !fileUploadValid) {
            alert("Enter emails or upload a proper file");
            return false;
        }
        tracking.track('detailsEntered');
        return false;
    };

    $("#email-details-form").isHappy({
        fields: {
            '#email-content': {required: true, message: 'Please enter some text'}
        },
        happy: validateEmails
    });
    sink.init();
    flow.bind();
    sampleFileDownload.init();
};
$(document).ready(function () {
    init();
    toggle.init();
});