var accountDetailsTemplate = require('../../views/partials/email_account_details.hbs');
var responseTemplate = require('../../views/send-email-response.hbs');
var Handlebars = require("hbsfy/runtime");
Handlebars.registerPartial('send_email_status', require('../../views/partials/send_email_status.hbs'));
var urlHelpers = require('../functions/url.helpers');
var emailData = require('../functions/email_data');
module.exports = {
    init: function () {
        $("#login-details").html(accountDetailsTemplate()).show();

        var bindFormSubmit = function(){
            var sendEmails = function () {
                event.preventDefault();
                $("#send-email-response").html('').hide();
                $("#send-spinner").show();
                $.ajax({
                    type : 'POST',
                    url: '/send-email',
                    data: $("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize() + '&' + $("#smtp-account-details").serialize(),
                    success: function (data) {
                        $("#smtp-email-response").html(responseTemplate(data)).show();
                        $("#send-spinner").hide();
                        return false;
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

        this.bindGmailLogin();
        bindFormSubmit();
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
    }
};