var accountDetailsTemplate = require('../../dist/templates/email_account_details.js');
var responseTemplate = require('../../dist/templates/email_send_response.js');
module.exports = {
    init: function () {
        $("#login-details").html(accountDetailsTemplate()).show();
        this.bindFormSubmit();
    },

    bindFormSubmit: function () {

        //todo : move this to another file
        var sendEmails = function () {
            event.preventDefault();
            console.log("ready to send the emails! finally :) ");
            $.ajax({
                type : 'POST',
                url: '/send-email',
                data: $("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize() + '&' + $("#email-account-details").serialize(),
                success: function (data) {
                    $("#send-email-response").html(responseTemplate(data));
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