var nodemailer = require("nodemailer");
var async = require('async');
var handlebarFactory = require(_ROOT + 'app//handlebar.factory.js');
module.exports = {
    sendEmails: function (emailArray, commonAttributes, service, finalCallback) {
        var fromEmail = commonAttributes['email-account'];
        var password = commonAttributes['password'];
        var getService = function () {
            var regex = /@([a-zA-Z0-9]+)\./;
            var address = fromEmail;
            return regex.exec(address)[1];
        };

        var transportObject = {
            service: service ? service : getService(),
            auth: {
                user: fromEmail,
                pass: password
            }
        };

        if(commonAttributes.accessToken){
            delete transportObject.auth.pass;
            transportObject.auth.xoauth2 = commonAttributes.accessToken;
        }
        var smtpTransport = nodemailer.createTransport(transportObject);
        var successful = true;
        var emailStatusArray = [];
        var shouldEmailResponse = emailArray.length > 10;
        async.each(emailArray,
            function(email, callback) {
                var mailOptions = {
                    from: commonAttributes['from-name'] + '<' + fromEmail + '>',
                    sender : fromEmail,
                    to: email.to,
                    replyTo : commonAttributes['replyTo'] ? commonAttributes['replyTo'] : "",
                    subject: email.subject,
                    text: email.text,
                    html: email.text
                };

                smtpTransport.sendMail(mailOptions, function (error, response) {
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
                    smtpTransport.close();
                    finalCallback({successful : successful, emails : emailStatusArray});
                } else {
                    var hbs = handlebarFactory.getInstance();
                    hbs.render(_ROOT + 'views/partials/send_email_status.hbs', {successful : successful, emails : emailStatusArray}).then(
                    function(html){
                        var mailOptions = {
                            from: '<' + fromEmail + '>',
                            sender : fromEmail,
                            to: fromEmail,
                            subject: 'Snail Mail Report - ' + emailArray[0].subject,
                            text: html,
                            html: html
                        };

                        smtpTransport.sendMail(mailOptions, function (error, response) {
                            if(error){
                                console.log("Error sending email report " + error);
                            }
                            smtpTransport.close();
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