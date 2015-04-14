var emailFunctions = require('../functions/email.functions');
var login = require('./login_details');
var Handlebars = require("hbsfy/runtime");
var emailAttributesTemplate = require('../../views/partials/email_attributes.hbs');
var emailAttributeRowTemplate = require('../../views/partials/email_attribute_row.hbs');
Handlebars.registerPartial('email_attribute_row', require('../../views/partials/email_attribute_row.hbs'));
var flow = require('./flow');
var emailPreview = require('../personalisation/preview');
var emailPersonalisation = require('../../app/email.personalisation');
module.exports = {
    init: function (attributeData) {
        var attributes = ['email'];
        attributes = attributes.concat(emailFunctions.getAttributes($('#email-content').val(), $("#subject").val()));
        if (attributes.length === 0) {
            login.init();
            return false;
        }
        this.renderView(attributes, attributeData);
        this.bindRowManipulation(attributes);
        this.bindFormSubmit();
        emailPreview.init();
    },

    renderView: function (attributes, attributeData) {
        $(".flow").hide();
        $("#enter-attributes").show();
        var emailContent = $("#email-content").val();
        var attributeViewData = [];
        attributeData.forEach(function(row, rowIndex){
            attributeViewData[rowIndex] = [];
            attributes.forEach(function(attributeName){
                attributeViewData[rowIndex].push({name : attributeName, value : row[attributeName]});
            });
        });
        var emailContentHtml = emailPersonalisation.getHTMLFromText(emailContent);
        $('#enter-attributes').html(emailAttributesTemplate({emailContent: emailContentHtml, emailAttributes : attributes, attributeRows : attributeViewData})).show();
    },

    bindFormSubmit: function () {
        var validEmails = function(){
            var emailElements = $("#attribute-details input[name=email]");
            var emailsValid = true;
            emailElements.each(function(index, element){
                 if(!emailFunctions.isValidEmail($(element).val())) {
                     emailsValid = false;
                     return false;
                 };
            });
            return emailsValid;
        };

        var emptyAttributes = function (formAttributes) {
            var filteredElements = formAttributes.filter(function (element) {
                return element.value === '';
            });
            return filteredElements.length > 0;
        };

        $("#submit-attributes").unbind('click');
        $("#submit-attributes").click(function () {
            var areEmailsValid = validEmails();
            if(!areEmailsValid){
                alert("enter valid emails!");
                return false;
            }
            var anyAttributeEmpty = emptyAttributes($("#attribute-details").serializeArray());
            $("#empty-attributes").toggle(anyAttributeEmpty);
            login.init();
            flow.moveTo("login-details");
            return false;
        });
    },
    bindRowManipulation : function(attributes){
        $("#email-attribute-table").on("click",".remove-email-row", function(){
            $(this).closest('tr').remove();
        });
        $("#add-email-row").unbind("click");
        $("#add-email-row").click(function(){
            var attributeViewData = [];
            attributes.forEach(function(row, index){
                attributeViewData[index] = {name : row, value : ''};
            });
            $("#email-attribute-table").append(emailAttributeRowTemplate(attributeViewData));
            return false;
        });
    }
};