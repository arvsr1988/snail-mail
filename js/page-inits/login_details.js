var accountDetailsTemplate = require('../../build/templates/email_account_details.js');
module.exports = {
    init : function(){
       $("#login-details").html(accountDetailsTemplate()).show();
       this.bindFormSubmit();
    },

    bindFormSubmit : function(){

        //todo : move this to another file
        var sendEmails = function(){
            event.preventDefault();
            console.log("ready to send the emails! finally :) ");
        };

        $("#email-account-details").isHappy({
            fields : {
                '#email' : {required : true, email : true, message : 'Please enter a valid email address'},
                '#password' : {required : true, message : 'Enter a password'}
            },
            happy : sendEmails
        });

    }
};