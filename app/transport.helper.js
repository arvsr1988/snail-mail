var smtpTransport = require('nodemailer-smtp-transport');

var getServiceTransport = function(serviceName, credentials){
    var fromEmail = credentials['email-account'];
    var password = credentials['password'];
    var getService = function () {
        var regex = /@([a-zA-Z0-9]+)\./;
        var address = fromEmail;
        return regex.exec(address)[1];
    };
    var transportObject = {
        service: serviceName ? serviceName : getService(),
        auth: {
            user: fromEmail,
            pass: password
        }
    };
    if(credentials.accessToken){
        delete transportObject.auth.pass;
        transportObject.auth.xoauth2 = credentials.accessToken;
    }
    return transportObject;
};

var getSmtpTransport = function(host, userName, password){
    var trans = smtpTransport({
        host: host,
        port: 25,
        auth: {
            user: userName,
            pass: password
        }
    });
    return trans;
};

exports.getServiceTransport = getServiceTransport;
exports.getSmtpTransport = getSmtpTransport;