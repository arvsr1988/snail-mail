var emailDataKey = "emailData";

var save = function(serializedForm){
    localStorage.setItem(emailDataKey, serializedForm);
};

var getEmailData = function(){
    return localStorage.getItem(emailDataKey);
};

var removeEmailData = function(){
    localStorage.removeItem(emailDataKey);
};

exports.getEmailData = getEmailData;
exports.save = save;
exports.removeEmailData = removeEmailData;