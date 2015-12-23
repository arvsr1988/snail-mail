var emailFunctions = require('../../js/functions/email.functions');
var getAttributesFromView = function(){
    var attributeArray = ['email'];
    attributeArray = attributeArray.concat(emailFunctions.getAttributes($('#email-content').val(), $("#subject").val()));
    return attributeArray;
};

exports.getAttributesFromView = getAttributesFromView;
