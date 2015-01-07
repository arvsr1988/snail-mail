var arrayHelpers = require('./array.helpers');
module.exports = {
    getAttributes : function(emailString, subject){
        var attributes = [];
        var setAttributes = function(fromString) {
            var patternString = /(?:\$\{)?([a-zA-Z0-9]+)(?:\})/g;
            var letter = fromString;
            var patternMatch;
            while((patternMatch = patternString.exec(letter)) !== null){
                attributes.push(patternMatch[1]);
            }
        };

        setAttributes(emailString);
        setAttributes(subject);
        return arrayHelpers.getUniqueItems(attributes);
    },

    isValidEmail : function(emailAddress){
        var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        return pattern.test(emailAddress);
    }
};