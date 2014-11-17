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
    }
};