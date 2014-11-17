var emailFunctions = require('../functions/email.functions');
var login = require('./login_details');
var emailAttributesTemplate = require('../../dist/templates/email_attributes.js');
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
    },

    renderView: function (attributes) {
        $(".flow").hide();
        $("#enter-attributes").show();
        var emailAddresses = $('#csv-recipients').val().split(',');
        var emailContent = $("#email-content").val();
        $('#enter-attributes').html(emailAttributesTemplate({emailContent: emailContent, emailAddresses: emailAddresses, emailAttributes: attributes})).show();
        this.bindFormSubmit();
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
    }
};