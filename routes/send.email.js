var emailer = require('./emailer');
var emailHelpers = require(_ROOT + 'routes/email.helpers');
var transportHelper = require(_ROOT + 'app/transport.helper.js');
var requestHelpers = require(_ROOT + 'app/request.helpers.js');

exports.send = function (req, res) {
    var smtpServer = req.body.smtpAddress;
    var smtpUser = req.body.smtpUsername;
    var smtpPassword = req.body.smtpPassword;
    var transportObject = transportHelper.getSmtpTransport(smtpServer, smtpUser, smtpPassword);
    var emailArray = emailHelpers.getEmailArray(requestHelpers.getHostName(req), req.body);
    const {attachmentName, attachmentData} = req.body;
    const attachment = {name : attachmentName, data: attachmentData}
    req.body.attachment = attachment;
    emailer.sendEmails(emailArray, req.body, transportObject, '', function (sendEmailResponse) {
        res.send(sendEmailResponse);
    });
};