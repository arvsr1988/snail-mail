const emailDataHelper = require('./functions/email_data');
const responseTemplate = require('../views/send-email-response.hbs');
const Handlebars = require("hbsfy/runtime");
const tracking = require('./tracking');

Handlebars.registerPartial('send_email_status', require('../views/partials/send_email_status.hbs'));

$(document).ready(function(){
    const {emailData, attachmentData} = emailDataHelper.getEmailData();
    const {name, data} = attachmentData;
    const attachmentString = name ? `&attachmentName=${encodeURIComponent(name)}&attachmentData=${encodeURIComponent(data)}` : '';
    const serializedFormData = emailData + attachmentString + '&googleOauthCode=' + $("#googleOauthCode").val();
    $.ajax({
        type : 'POST',
        url : '/send-gmail-emails',
        data : serializedFormData,
        success : function(data){
            var sendResponseHtml = responseTemplate(data);
            $("#sending-container").html(sendResponseHtml);
            emailDataHelper.removeEmailData();
            if(!data.successful){
                return false;
            }
            tracking.track('gmailEmailsSent');
        }, error : function(error){
            alert(error);
        }
    });
});