const accountDetailsTemplate = require('../../views/partials/email_account_details.hbs');
const urlHelpers = require('../functions/url.helpers');
const sendViaSmtp = require('../email_sending/send_via_smtp');
const tracking = require('../tracking');

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
        tracking.track('gmailLoginClick');
        window.location.href = url + "&redirect_uri=" + encodeURIComponent(urlHelpers.getHost() + "/googleOauthResponse");
        return false;
      });
    }
};
