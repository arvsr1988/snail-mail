var accountDetailsTemplate = require('../../views/partials/email_account_details.hbs');
var responseTemplate = require('../../views/partials/email_send_response.hbs');
var urlHelpers = require('../functions/url.helpers');
var emailData = require('../functions/email_data');
module.exports = {
    init: function () {
        $("#login-details").html(accountDetailsTemplate()).show();
        this.bindGmailLogin();
        this.bindFormSubmit();
    },

    bindGmailLogin : function(){
        $("#gmail-login-link").click(function(){
            var url = $(this).attr("href");
            var serializedFormDetails = $("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize();
            emailData.save(serializedFormDetails, function(successful){
                if(!successful){
                    alert("Oops, something went wrong. Please try again");
                }
                window.location.href = url + "&redirect_uri=" + encodeURIComponent(urlHelpers.getHost() + "/googleOuathResponse");
            });
            return false;
        });
    },

    bindFormSubmit: function () {
        var sendEmails = function () {
            event.preventDefault();
            $("#send-email-response").hide();
            $("#send-spinner").show();
            $.ajax({
                type : 'POST',
                url: '/send-email',
                data: $("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize() + '&' + $("#email-account-details").serialize(),
                success: function (data) {
                    $("#send-email-response").html(responseTemplate(data));
                    $("#send-email-response").show();
                    $("#send-spinner").hide();
                }
            });
        };
    }
};