var emailPersonalisation = require('./email_personalisation.js');
var emailFunctions = require('../functions/email.functions.js');
var flow = require('./flow');
module.exports = {
    init : function() {
        console.log("inside index page 1");
        var csvEmailsValid = function(csvEmailString){
            var individualEmails = csvEmailString.split(",");
            var emailsValid = individualEmails.every(function(email){
               return emailFunctions.isValidEmail(email.trim());
            });
            return emailsValid;
        };


        var submitForm = function(){
            event.preventDefault();
            emailPersonalisation.init();
            flow.moveTo("enter-attributes");
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

        flow.bind();
    }
};