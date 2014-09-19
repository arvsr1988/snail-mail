var homeTemplate = require('../../build/templates/home.js');
var emailPersonalisation = require('./email_personalisation.js');

module.exports = {
    init : function() {
        console.log("inside index page 1");

        var isValidEmail = function (emailAddress) {
            var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            return pattern.test(emailAddress);
        };

        var csvEmailsValid = function(csvEmailString){
            var individualEmails = csvEmailString.split(",");
            var emailsValid = individualEmails.every(function(email){
               return isValidEmail(email.trim());
            });
            return emailsValid;
        };


        var submitForm = function(){
            event.preventDefault();
            console.log("valid inputs");
            emailPersonalisation.init();
            return false;
        };

        $("#email-details-form").isHappy({
            fields : {
                '#from-name': { required : true, message : 'Please enter your name'},
                '#email-content': { required : true, message : 'Please enter some text'},
                '#csv-recipients': {
                    required: true,
                    test : csvEmailsValid,
                    message : "please enter comma seperated email addresses"
                }
            },
            happy : submitForm
        });

    }
};