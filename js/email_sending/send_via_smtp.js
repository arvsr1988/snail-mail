var responseTemplate = require('../../views/send-email-response.hbs');
var Handlebars = require("hbsfy/runtime");
Handlebars.registerPartial('send_email_status', require('../../views/partials/send_email_status.hbs'));
var tracking = require('../tracking');
const emailDataHelper = require('../functions/email_data');

var handleSendEmailResponse = function(data){
    $(".smtp-submit-element").toggle();
    if(data.successful){
        document.forms["smtp-account-details"].reset();
        tracking.track('smtpEmailsSent');
        emailDataHelper.removeEmailData();
    }
    $("#smtp-email-response").html(responseTemplate(data)).show();
    $("body").scrollTop($("#smtp-email-response").offset().top - 5);
    return false;
};

var bindSmtpFormSubmit = function(){
    var sendEmails = function () {
      const {emailData, attachmentData} = emailDataHelper.getEmailData();
      const {name, data} = attachmentData;
      const attachmentString = name ? `&attachmentName=${encodeURIComponent(name)}&attachmentData=${encodeURIComponent(data)}` : '';
        $("#send-email-response").html('').hide();
        $(".smtp-submit-element").toggle();
        $.ajax({
            type : 'POST',
            url: '/send-email',
            data: emailData + attachmentString + '&' + $("#smtp-account-details").serialize(),
            success: function (data) {
                handleSendEmailResponse(data);
            }
        });
        return false;
    };
    $("#smtp-account-details").isHappy({
        fields: {
            '#smtpAddress': {required: true, message: 'Please enter an smtp address'},
            '#senderEmail' : {required: true, message: 'Please enter a valid email address'},
            '#smtpUserName': {required: true, message: 'Enter a user name'},
            '#smtpPassword': {required: true, message: 'Enter a password'}
        },
        happy: sendEmails
    });
};

var initialiseSmtpFormToggle = function(){
    $("#smtp-form-header").click(function(){
        $("#smtp-form-body").toggle();
    });
};

var init = function(){
    initialiseSmtpFormToggle();
    bindSmtpFormSubmit();
};
exports.init = init;