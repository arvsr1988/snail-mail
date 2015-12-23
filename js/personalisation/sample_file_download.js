var emailFunctions = require('../../js/functions/email.functions.js');
var writeEmailViewModel = require('../../js/view_models/write_email.js')
var init = function(){
  $("#sampleAttributeFile").click(function(){
      var attributeArray = writeEmailViewModel.getAttributesFromView();
      var attributeString = attributeArray.join(',');
      attributeString = attributeString.concat('\nfirst recipient details\nsecond recipient details');
      var a = window.document.createElement('a');

      a.href = window.URL.createObjectURL(new Blob([attributeString], {type: 'text/csv'}));
      a.download = 'my_email.csv';

      // Append anchor to body.
      document.body.appendChild(a)
      a.click();

      // Remove anchor from body
      document.body.removeChild(a);
  });
};

exports.init = init;
