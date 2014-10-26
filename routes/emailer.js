var nodemailer = require("nodemailer");
var async = require('async');
module.exports = {
    sendEmails: function (emailArray, commonAttributes, finalCallback) {
        var fromEmail = commonAttributes['email-account'];
        var password = commonAttributes['password'];
        var getService = function () {
            var regex = /@([a-zA-Z0-9]+)\./;
            var address = fromEmail;
            return regex.exec(address)[1];
        };

        var smtpTransport = nodemailer.createTransport({
            service: getService(),
            auth: {
                user: fromEmail,
                pass: password
            }
        });

        var emailResponses = [];
        async.each(emailArray,
            function(email, callback) {
                var mailOptions = {
                    from: commonAttributes['from-name'] + '<' + fromEmail + '>',
                    sender : fromEmail,
                    to: email.to,
                    subject: commonAttributes['subject'],
                    text: email.text,
                    html: email.text
                };


                smtpTransport.sendMail(mailOptions, function (error, response) {
                    emailResponses.push({email : email, error : error, response : response, successful : !error});
                    callback(error);
                });
            }
            ,function(err){
                console.log(err);
                smtpTransport.close();
                finalCallback(emailResponses);
            });
    }
};