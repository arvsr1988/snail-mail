var accountDetailsTemplate = require('../../views/partials/email_account_details.hbs');
var responseTemplate = require('../../views/partials/email_send_response.hbs');
var urlHelpers = require('../functions/url.helpers');
module.exports = {
    init: function () {
        $("#login-details").html(accountDetailsTemplate()).show();
        this.bindGmailLogin();
        this.bindFormSubmit();
    },

    bindGmailLogin : function(){
        $("#gmail-login-link").click(function(){
            var url = $(this).attr("href");
            url = url + "&state=" + encodeURIComponent($("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize());
            url = url + "&redirect_uri=" + encodeURIComponent(urlHelpers.getHost() + "/googleOuathResponse");
            $(this).attr("href", url);
        });
    },

    bindFormSubmit: function () {

        //todo : move this to another file
        var sendEmails = function () {
            event.preventDefault();
            console.log("ready to send the emails! finally :) ");
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

        $("#email-account-details").isHappy({
            fields: {
                '#email': {required: true, email: true, message: 'Please enter a valid email address'},
                '#password': {required: true, message: 'Enter a password'}
            },
            happy: sendEmails
        });
    }
};