var nodemailer = require("nodemailer");
var async = require('async');
var handlebarFactory = require(_ROOT + 'app//handlebar.factory.js');
var sentEmailLinks = {
    'Gmail' : 'https://mail.google.com/mail/u/0/?pli=1#sent'
};
module.exports = {
    sendEmails: function (emailArray, commonAttributes, transportObject, serviceName, finalCallback) {
        var fromEmail = commonAttributes['email-account'];
        var transport = nodemailer.createTransport(transportObject);
        var successful = true;
        var emailStatusArray = [];
        var shouldEmailResponse = emailArray.length > 10;
        const {attachment} = commonAttributes;
        const attachments = [];
        const {name, data} = attachment;
        if(name){
          attachments.push({
            filename: name,
            content: new Buffer(data,'base64')
          });
        }
        async.eachSeries(emailArray,
            function(email, callback) {
                var mailOptions = {
                    from: commonAttributes['from-name'] + '<' + fromEmail + '>',
                    sender : fromEmail,
                    to: email.to,
                    replyTo : commonAttributes['replyTo'] ? commonAttributes['replyTo'] : "",
                    subject: email.subject,
                    text: email.text,
                    html: email.text,
                    attachments
                };

                transport.sendMail(mailOptions, function (error, response) {
                    successful = successful && !error;
                    var emailStatus = {successful : !error, to : email.to, error : ''};
                    if(error){
                        emailStatus.error = error.response;
                    }
                    emailStatusArray.push(emailStatus);
                    if(error){
                        console.log("ERROR sending an email -- " + error);
                    }
                    callback(null);
                });
            }
            ,function(){
                if(!shouldEmailResponse){
                    transport.close();
                    finalCallback({successful : successful, emails : emailStatusArray, sentEmailLink : sentEmailLinks[serviceName]});
                } else {
                    var hbs = handlebarFactory.getInstance();
                    hbs.render(_ROOT + 'views/partials/send_email_status.hbs', {successful : successful, emails : emailStatusArray,  sentEmailLink : sentEmailLinks[serviceName]}).then(
                    function(html){
                        var mailOptions = {
                            from: '<' + fromEmail + '>',
                            sender : fromEmail,
                            to: fromEmail,
                            subject: 'Snail Mail Report - ' + emailArray[0].subject,
                            text: html,
                            html: html
                        };

                        transport.sendMail(mailOptions, function (error, response) {
                            if(error){
                                console.log("Error sending email report " + error);
                            }
                            transport.close();
                        });
                    });
                }
            });
        if(!shouldEmailResponse) {
            return false;
        }
        finalCallback({responseByEmail : true});
    }
};
