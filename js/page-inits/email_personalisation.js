var emailFunctions = require('../functions/email.functions');
var login = require('./login_details');
var Handlebars = require("hbsfy/runtime");
var emailAttributesTemplate = require('../../views/partials/email_attributes.hbs');
var emailAttributeRowTemplate = require('../../views/partials/email_attribute_row.hbs');
Handlebars.registerPartial('email_attribute_row', require('../../views/partials/email_attribute_row.hbs'));
var flow = require('./flow');
module.exports = {
    init: function () {
        var attributes = [];
        attributes = attributes.concat(emailFunctions.getAttributes($('#email-content').val(), $("#subject").val()));
        if (attributes.length === 0) {
            login.init();
            return false;
        }
        this.renderView(attributes);
        this.bindRowManipulation(attributes);
        this.bindFormSubmit();
    },

    renderView: function (attributes) {
        $(".flow").hide();
        $("#enter-attributes").show();
        var emailAddresses = $('#csv-recipients').val().split(',');
        var emailContent = $("#email-content").val();
        var emails = [];
        emailAddresses.forEach(function(address){
            var email = {address : address, attributes : attributes};
            emails.push(email);
        });
        $('#enter-attributes').html(emailAttributesTemplate({emailContent: emailContent, emails : emails, emailAttributes : attributes})).show();
    },

    bindFormSubmit: function () {
        var validEmails = function(){
            var emailElements = $("#attribute-details input[name=recipientEmails]");
            //to do arvind : break off if at least one of them isnt valid
            var emailsValid = emailElements.filter(function(email){
                return emailFunctions.isValidEmail($(email).val());
            });
            return emailsValid.length === emailElements.length;
        };

        var emptyAttributes = function (formAttributes) {
            var filteredElements = formAttributes.filter(function (element) {
                return element.value === '';
            });
            return filteredElements.length > 0;
        };

        $("#submit-attributes").unbind('click');
        $("#submit-attributes").click(function (event) {
            event.preventDefault();
            console.log($("#attribute-details").serializeArray());
            var areEmailsValid = validEmails();
            if(!areEmailsValid){
                alert("enter valid emails!");
                return false;
            }
            var anyAttributeEmpty = emptyAttributes($("#attribute-details").serializeArray());
            $("#empty-attributes").toggle(anyAttributeEmpty);
            login.init();
            flow.moveTo("login-details");
        });
    },
    bindRowManipulation : function(attributes){
        $("#email-attribute-table").on("click",".remove-email-row", function(){
            $(this).closest('tr').remove();
        });
        $("#add-email-row").unbind("click");
        $("#add-email-row").click(function(){
            $("#email-attribute-table").append(emailAttributeRowTemplate({address : '', attributes : attributes}));
            return false;
        });
    }
};