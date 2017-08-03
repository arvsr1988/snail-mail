const accountDetailsTemplate = require('../../views/partials/email_account_details.hbs');
const urlHelpers = require('../functions/url.helpers');
const emailData = require('../functions/email_data');
const sendViaSmtp = require('../email_sending/send_via_smtp');
const tracking = require('../tracking');
const fileUploadHandler = require('../personalisation/file.upload.handler');

module.exports = {
    init: function () {
      $("#login-details").html(accountDetailsTemplate()).show();
      this.bindGmailLogin();
      sendViaSmtp.init();
    },

    bindGmailLogin : function(){
      $("#gmail-login-link").click(function(event){
        event.preventDefault();
        const url = $(this).attr("href");
        const serializedFormDetails = $("#attribute-details").serialize() + '&' +  $("#email-details-form").serialize();
        fileUploadHandler.getAttachment().then(attachmentData => {
          emailData.save({emailData: serializedFormDetails, attachmentData});
          tracking.track('gmailLoginClick');
          window.location.href = url + "&redirect_uri=" + encodeURIComponent(urlHelpers.getHost() + "/googleOauthResponse");
          return false;
        }).catch(e => {
          alert("oh no, something went wrong. please try again.");
          console.log(e);
        })
      });
    }
};