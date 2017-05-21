var emailFunctions = require('../functions/email.functions');
var login = require('./login_details');
var Handlebars = require("hbsfy/runtime");
var emailAttributesTemplate = require('../../views/partials/email_attributes.hbs');
var emailAttributeRowTemplate = require('../../views/partials/email_attribute_row.hbs');
Handlebars.registerPartial('email_attribute_row', require('../../views/partials/email_attribute_row.hbs'));
var flow = require('./flow');
var emailPreview = require('../personalisation/preview');
var emailPersonalisation = require('../../app/email.personalisation');
var tracking = require('../tracking');
var writeEmailViewModel = require('../view_models/write_email');

const getEmailAttributeRowData = (attributes, attributeData, rowIndexStart) => {
  var attributeViewData = [];
  rowIndexStart = rowIndexStart || 0;
  attributeData.forEach(function(row, rowIndex){
      attributeViewData.push({rowIndex : rowIndex + rowIndexStart, rowData : []});
      attributes.forEach(function(attributeName){
          attributeViewData[rowIndex].rowData.push({name : attributeName, value : row[attributeName] || ''});
      });
  });
  return attributeViewData;
}

module.exports = {
    init: function (attributeData) {
        var attributes = writeEmailViewModel.getAttributesFromView();
        this.renderView(attributes, attributeData);
        this.bindRowManipulation(attributes);
        this.bindFormSubmit();
        emailPreview.init();
    },

    renderView: function (attributes, attributeData) {
        flow.moveTo("enter-attributes");
        var emailContent = $("#email-content").val();
        var attributeViewData = getEmailAttributeRowData(attributes, attributeData);
        var emailContentHtml = emailPersonalisation.getHTMLFromText(emailContent);
        $('#enter-attributes').html(emailAttributesTemplate({subject : $("#subject").val(), emailContent: emailContentHtml, emailAttributes : attributes, attributeRows : attributeViewData})).show();
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
            tracking.track('submitPersonalisation', $("#attribute-details input[name=email]").length);
            return false;
        });
    },
    bindRowManipulation : function(attributes){
        $("#email-attribute-table").on("click",".remove-email-row", function(){
            $(this).closest('tr').remove();
            $(".preview-button").each(function(button){
              $(this).data('index', button);
            });
        });
        $("#add-email-row").unbind("click");
        $("#add-email-row").click(function(){
            var attributeViewData = getEmailAttributeRowData(attributes, [{email : ''}], $(".email-row").length);
            $("#email-attribute-table tbody").append(emailAttributeRowTemplate(attributeViewData[0]));
            return false;
        });
    }
};
