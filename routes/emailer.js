var nodemailer = require("nodemailer");
var async = require('async');
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
        async.each(emailArray,
            function(email, callback) {
                var mailOptions = {
                    from: commonAttributes['from-name'] + '<' + fromEmail + '>',
                    sender : fromEmail,
                    to: email.to,
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
                smtpTransport.close();
                finalCallback({successful : successful, emails : emailStatusArray});
            });
    }
};