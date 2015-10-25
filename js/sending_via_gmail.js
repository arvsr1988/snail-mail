var emailData = require('./functions/email_data');
var responseTemplate = require('../views/send-email-response.hbs');
var Handlebars = require("hbsfy/runtime");
Handlebars.registerPartial('send_email_status', require('../views/partials/send_email_status.hbs'));
var tracking = require('./tracking');
$(document).ready(function(){
    var savedEmails = emailData.getEmailData();
    var serializedFormData = savedEmails + '&googleOauthCode=' + $("#googleOauthCode").val();
    console.log(JSON.stringify(savedEmails));
    $.ajax({
        type : 'POST',
        url : '/send-gmail-emails',
        data : serializedFormData,
        success : function(data){
            var sendResponseHtml = responseTemplate(data);
            $("#sending-container").html(sendResponseHtml);
            emailData.removeEmailData();
            if(!data.successful){
                return false;
            }
            tracking.track('gmailEmailsSent');
        }, error : function(error){
            alert(error);
        }
    });
});