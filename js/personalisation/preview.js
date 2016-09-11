var emailPersonalisation = require('../../app/email.personalisation');
var previewTemplate = require('../../views/partials/email_preview.hbs');
var init = function(){
    var moveIndex = function(index, modal){
        modal.destroy();
        $('.preview-button[data-index="'+ index + '"]').click();
    };
    var bindPreviousAndNextButtons = function(currentIndex, modal){
        $("#previous").unbind('click').click(function(){
            moveIndex(currentIndex - 1, modal);
        });
        $("#next").unbind('click').click(function(){
            moveIndex(currentIndex + 1, modal);
        });
    };
    var emailTable = $("#email-attribute-table");
    emailTable.on('click','.preview-button', function(){
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
        var currentButtonIndex = $(this).data('index');
        var previewEmailData = attributeData[0];
        previewEmailData.showNextButton = $(".preview-button").length > currentButtonIndex + 1;
        previewEmailData.showPrevButton = currentButtonIndex > 0;

        var modal = picoModal(
            {
                'width': '90%',
                'max-width' : '600px',
                'content' : previewTemplate(previewEmailData),
                'modalClass' : 'email-preview-overlay',
                'height' : '75%'
            }
        ).show();
        bindPreviousAndNextButtons(currentButtonIndex, modal);
        return false;
    });
};
exports.init = init;
