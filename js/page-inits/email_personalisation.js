var emailFunctions = require('../functions/email.functions');
var emailAttributesTemplate = require('../../build/templates/email_attributes.js');
module.exports = {
  init : function(){
      var emailAttributes = emailFunctions.getAttributes($('#email-content').val());
      var emailAddresses = $('#csv-recipients').val().split(',');
      $('#enter-attributes').html(emailAttributesTemplate({emailAddresses : emailAddresses, emailAttributes : emailAttributes})).show();
      console.log("COmplete this!");
      this.bindFormSubmit();
  },
    bindFormSubmit : function(){

        var emptyAttributes = function(formAttributes){
            formAttributes.filter(function(element){
                return element !== '';
            });
        };

        $("#submit-attributes").unbind('click');
        $("#submit-attributes").click(function(event){
           event.preventDefault();
           console.log($("#attribute-details").serializeArray());
            var anyAttributeEmpty = emptyAttributes($("#attribute-details").serializeArray());
            $("#empty-attributes").toggle(anyAttributeEmpty);
        });
    }
};