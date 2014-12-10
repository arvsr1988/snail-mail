var emailFunctions = require('../functions/email.functions');
var login = require('./login_details');
var Handlebars = require("hbsfy/runtime");
var emailAttributesTemplate = require('../../views/partials/email_attributes.hbs');
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
        $('#enter-attributes').html(emailAttributesTemplate({emailContent: emailContent, emailAddresses: emailAddresses, emailAttributes: attributes})).show();
    },

    bindFormSubmit: function () {
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
            var anyAttributeEmpty = emptyAttributes($("#attribute-details").serializeArray());
            $("#empty-attributes").toggle(anyAttributeEmpty);
            login.init();
            flow.moveTo("login-details");
        });
    },
    bindRowManipulation : function(){
        $("#email-attribute-table").on("click",".email-row-button", function(){
            var addRow = $(this).hasClass("add");
            if(addRow){
                alert("add new row. TODO : complete");
                return false;
            }

            $(this).parent('tr').remove();
        });
    }
};