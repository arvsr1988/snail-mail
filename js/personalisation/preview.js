var emailPersonalisation = require('../../app/email.personalisation');
var previewTemplate = require('../../views/partials/email_preview.hbs');
var init = function(){
    $(".preview-button").click(function(){
        var closestRow = $(this).closest("tr").children();
        var attributeMap = {};
        $(closestRow).each(function(){
            var tagName = $(this).children('input');
            if(!tagName.length){
                return false;
            }
            attributeMap[$(tagName).prop("name")] = $(tagName).val();
        });

        var options = {includeSignature : $("#includeSignature").prop("checked")};
        var subject = $("#subject").val();
        var text = $("#email-content").val();
        var personalisationData = [attributeMap];
        var attributeData = emailPersonalisation.getEmails(window.location.hostname, options, subject, text, personalisationData);
        picoModal(
            {
                'width': '50%',
                'max-width' : '600px',
                'content' : previewTemplate(attributeData[0]),
                modalClass : 'email-preview-overlay'
            }
        ).show();
        return false;
    });
};

exports.init = init;